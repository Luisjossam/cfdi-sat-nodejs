import { create } from "xmlbuilder2";
import {
  atributosInterface,
  ReceptorInterface,
  EmisorInterface,
  atributosConceptoInterface,
} from "../interfaces/facturaInterfaces";
export class CFDIIngreso {
  atributos: atributosInterface;
  noCertificado: string;
  certificado: string;
  emisor: { Rfc: string; Nombre: string; RegimenFiscal: string };
  receptor: {
    Rfc: string;
    Nombre: string;
    RegimenFiscal: string;
    DomicilioFiscalReceptor: number | string;
    RegimenFiscalReceptor: number | string;
    UsoCFDI: string;
  };
  conceptos: atributosConceptoInterface[];
  constructor(
    atributos: atributosInterface,
    emisor: EmisorInterface,
    receptor: ReceptorInterface,
    certificado: string,
    noCertificado: string,
    conceptos: atributosConceptoInterface[]
  ) {
    this.atributos = atributos;
    this.receptor = receptor;
    this.emisor = emisor;
    this.certificado = certificado;
    this.noCertificado = noCertificado;
    this.conceptos = conceptos;
  }
  crearXMl(generarSello: boolean = false) {
    const date = this.atributos.fecha || new Date().toISOString().split(".")[0];
    const serie_cfdi = this.atributos.serie || "F";
    const tipoComprobante_cfdi = this.atributos.tipoComprobante || "I";
    const condicionesPago_cfdi = this.atributos.condicionesDePago || null;
    const moneda_cfdi = this.atributos.moneda || "MXN";
    const exportacion_cfdi = this.atributos.exportacion || "01";
    const xml = create({ version: "1.0", encoding: "UTF-8" }).ele(
      "cfdi:Comprobante",
      {
        "xsi:schemaLocation":
          "http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd",
        "xmlns:cfdi": "http://www.sat.gob.mx/cfd/4",
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        Version: "4.0",
        Serie: serie_cfdi,
        Folio: this.atributos.folio,
        Fecha: date,
        SubTotal: this.atributos.subtotal,
        Moneda: moneda_cfdi,
        Total: this.atributos.total,
        TipoDeComprobante: tipoComprobante_cfdi,
        Exportacion: exportacion_cfdi,
        MetodoPago: this.atributos.metodoPago,
        FormaPago: this.atributos.formaPago,
        LugarExpedicion: this.atributos.lugarExpedicion,
        NoCertificado: this.noCertificado,
        Certificado: this.certificado,
      }
    );
    if (condicionesPago_cfdi) {
      xml.att("CondicionesDePago", condicionesPago_cfdi);
    }
    xml.ele("cfdi:Emisor", {
      Rfc: this.emisor.Rfc,
      Nombre: this.emisor.Nombre,
      RegimenFiscal: this.emisor.RegimenFiscal,
    });
    xml.ele("cfdi:Receptor", {
      Rfc: this.receptor.Rfc,
      Nombre: this.receptor.Nombre,
      DomicilioFiscalReceptor: this.receptor.DomicilioFiscalReceptor,
      RegimenFiscalReceptor: this.receptor.RegimenFiscalReceptor,
      UsoCFDI: this.receptor.UsoCFDI,
    });
    const conceptos_ele = xml.ele("cfdi:Conceptos");
    let totalImpuestosTrasladados: number = 0;
    let totalImpuestosRetenidos: number = 0;
    this.conceptos.forEach((item) => {
      const concepto_ele = conceptos_ele.ele("cfdi:Concepto", {
        ClaveProdServ: item.ClaveProdServ,
        Cantidad: item.Cantidad,
        ClaveUnidad: item.ClaveUnidad,
        Unidad: item.Unidad,
        Descripcion: item.Descripcion,
        ValorUnitario: parseFloat(item.ValorUnitario.toString()).toFixed(2),
        Importe: parseFloat(item.Importe.toString()).toFixed(2),
        ObjetoImp: item.ObjetoImp,
      });
      if (item.NoIdentificacion) {
        concepto_ele.att("NoIdentificacion", item.NoIdentificacion);
      }
      if (item.Descuento) {
        concepto_ele.att(
          "Descuento",
          parseFloat(item.Descuento.toString()).toFixed(2)
        );
      }
      const impuestos_ele = concepto_ele.ele("cfdi:Impuestos");
      if (item.Impuesto.Impuesto === "002") {
        const traslados_ele = impuestos_ele.ele("cfdi:Traslados");
        const base_imp_total: number = item.Descuento
          ? parseFloat(item.Importe.toString()) -
            parseFloat(item.Descuento.toString())
          : parseFloat(item.Importe.toString());
        const TasaOCuota: number = parseFloat(
          item.Impuesto.TasaOCuota.toString()
        );
        const importe = (base_imp_total * TasaOCuota).toFixed(2);
        totalImpuestosTrasladados += parseFloat(importe);
        traslados_ele.ele("cfdi:Traslado", {
          Base: base_imp_total.toFixed(2),
          Impuesto: item.Impuesto.Impuesto,
          TipoFactor: item.Impuesto.TipoFactor,
          TasaOCuota: TasaOCuota.toFixed(6),
          Importe: importe,
        });
      }

      if (item.Retenciones) {
        const retenciones_ele = impuestos_ele.ele("cfdi:Retenciones");
        item.Retenciones.forEach((retencion) => {
          let descuento: number = 0;
          if (item.Descuento) {
            descuento = item.Descuento;
          }
          const base: string =
            retencion.Impuesto.toString() === "003"
              ? item.Cantidad.toString()
              : (parseFloat(item.Importe.toString()) - descuento).toFixed(2);
          const impuesto: string =
            retencion.Impuesto === "003_f" ? "003" : retencion.Impuesto;
          const tipoFactor: string =
            retencion.Impuesto === "003" ? "Cuota" : "Tasa";
          const tasaocuota: number = parseFloat(
            retencion.TasaOCuota.toString()
          );
          const importe: string = (parseFloat(base) * tasaocuota).toFixed(2);
          retenciones_ele.ele("cfdi:Retencion", {
            Base: base,
            Impuesto: impuesto,
            TipoFactor: tipoFactor,
            TasaOCuota: tasaocuota.toFixed(6),
            Importe: importe,
          });
          totalImpuestosRetenidos += parseFloat(importe);
        });
      }
    });
    //
    const impuestos_ele = xml.ele("cfdi:Impuestos", {
      TotalImpuestosTrasladados: totalImpuestosTrasladados.toFixed(2),
    });
    if (totalImpuestosRetenidos > 0) {
      impuestos_ele.att(
        "TotalImpuestosRetenidos",
        totalImpuestosRetenidos.toFixed(2)
      );
    }
    const retenciones_ele = impuestos_ele.ele("cfdi:Retenciones");
    const array_retenciones: any = [];

    this.conceptos.forEach((item) => {
      if (item.Retenciones) {
        item.Retenciones.forEach((retencion) => {
          const impuesto = retencion.Impuesto;
          let descuento = item.Descuento || 0;
          let base: any;

          if (impuesto === "003") {
            base = parseFloat(item.Cantidad.toString());
          } else {
            base = (parseFloat(item.Importe.toString()) - descuento).toFixed(2);
          }

          const tasaocuota = parseFloat(retencion.TasaOCuota.toString());
          const importe = (parseFloat(base) * tasaocuota).toFixed(2);

          const existingRetencion = array_retenciones.find(
            (r: any) => r.Impuesto === impuesto && r.TasaOCuota === tasaocuota
          );
          if (existingRetencion) {
            existingRetencion.Importe += parseFloat(importe);
          } else {
            array_retenciones.push({
              Impuesto: impuesto,
              TasaOCuota: tasaocuota,
              Importe: parseFloat(importe),
            });
          }
        });
      }
    });

    if (array_retenciones.length > 0) {
      array_retenciones.forEach((object: any) => {
        retenciones_ele.ele("cfdi:Retencion", {
          Impuesto: object.Impuesto === "003_f" ? "003" : object.Impuesto,
          Importe: object.Importe.toFixed(2),
        });
      });
    }
    /*   */
    const traslados_ele = impuestos_ele.ele("cfdi:Traslados");
    const array_traslados: any = [];
    this.conceptos.forEach((item) => {
      if (item.Impuesto && item.Impuesto.Impuesto === "002") {
        const impuesto = item.Impuesto.Impuesto;
        let descuento = item.Descuento || 0;
        const base: string = (
          parseFloat(item.Importe.toString()) - descuento
        ).toFixed(2);

        const tasaocuota: number = parseFloat(
          item.Impuesto.TasaOCuota.toString()
        );
        const importe: string = (parseFloat(base) * tasaocuota).toFixed(2);

        const existingRetencion = array_traslados.find(
          (r: any) =>
            r.Impuesto === impuesto && r.TasaOCuota === tasaocuota.toFixed(6)
        );
        if (existingRetencion) {
          existingRetencion.Base = (
            parseFloat(existingRetencion.Base) + parseFloat(base)
          ).toFixed(2);
          existingRetencion.Importe = (
            parseFloat(existingRetencion.Importe) + parseFloat(importe)
          ).toFixed(2);
        } else {
          array_traslados.push({
            Base: parseFloat(base).toFixed(2),
            Importe: parseFloat(importe).toFixed(2),
            Impuesto: impuesto,
            TasaOCuota: tasaocuota.toFixed(6),
            TipoFactor: impuesto === "003" ? "Cuota" : "Tasa",
          });
        }
      }
    });
    if (array_traslados.length > 0) {
      array_traslados.forEach((object: any) => {
        traslados_ele.ele("cfdi:Traslado", {
          Base: object.Base,
          Importe: object.Importe,
          Impuesto: object.Impuesto === "003_f" ? "003" : object.Impuesto,
          TasaOCuota: object.TasaOCuota,
          TipoFactor: object.TipoFactor,
        });
      });
    }
    return xml.end({ prettyPrint: true });
  }
}
