import { XMLBuilder } from "xmlbuilder2/lib/interfaces";
import {
  IComprobanteOutput,
  IInformacionGlobalOutput,
  INodeACuentaTercerosOutput,
  INodeConceptoOutput,
  INodeEmisorOutput,
  INodeImpuestosOutput,
  INodeParteOutput,
  INodeReceptorOutput,
} from "../../interfaces/ICfdiOutput";
import Cfdi from "../Cfdi";
import { create } from "xmlbuilder2";
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import { INodeACuentaTerceros, INodeConc, INodeConcParte, INodeImpuestos } from "../../interfaces/ICfdi";
import generateCadenaOriginal from "../../utils/generateCadenaOriginal";
import Utils from "../../classes/Utils";
import Parse from "../../utils/Parse";
type TConceptoWithTraslado = { base: string; importe?: string; impuesto: "001" | "002" | "003"; tasaOCuota?: string; tipoFactor: string };
type TConceptoWithRetencion = { impuesto: "001" | "002" | "003"; importe?: string };

class CfdiBuilder {
  private readonly conceptos_with_traslado: TConceptoWithTraslado[] = [];
  private readonly conceptos_with_retencion: TConceptoWithRetencion[] = [];
  private currency_decimals: number = 2;
  constructor(private readonly cfdi: Cfdi) {}
  public async buildXml(): Promise<string> {
    return this.build();
  }
  public async buildXmlSellado(): Promise<string> {
    const xml = this.build();
    return generateCadenaOriginal(xml, this.cfdi.getConfigCfdi())
      .then((sign) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "application/xml");
        const comprobanteElement = xmlDoc.getElementsByTagName("cfdi:Comprobante")[0];
        if (comprobanteElement) {
          comprobanteElement.setAttribute("Sello", sign);
        }
        const serializer = new XMLSerializer();
        return serializer.serializeToString(xmlDoc);
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }
  public async buildJson(simplified: boolean): Promise<Record<string, string>> {
    const xml = this.build();
    const json = Utils.xmlToJson(xml);
    return simplified ? new Utils().simplifyJson(json) : json;
  }
  public async buildJsonSellado(simplified: boolean): Promise<Record<string, string>> {
    const xml = await this.buildXmlSellado();
    const json = Utils.xmlToJson(xml);
    return simplified ? new Utils().simplifyJson(json) : json;
  }
  private build(): string {
    const doc = create({
      version: "1.0",
      encoding: "utf-8",
    }).ele("cfdi:Comprobante", this.buildNodeComprobante());
    if (this.cfdi.getDataInformacionGlobal()) {
      doc.ele("cfdi:InformacionGlobal", this.buildNodeInformacionGlobal());
    }
    this.buildNodeCfdiRelacionados(doc);
    doc.ele("cfdi:Emisor", this.buildNodeEmisor());
    doc.ele("cfdi:Receptor", this.buildNodeReceptor());
    this.buildNodeConceptos(doc);
    this.buildNodeImpuestos(doc);
    this.buildNodeAddenda(doc);

    return doc.end({ prettyPrint: true });
  }
  private buildNodeComprobante(): IComprobanteOutput {
    const data = this.cfdi.getDataComprobante();
    const result: IComprobanteOutput = {
      "xsi:schemaLocation": "http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd",
      "xmlns:cfdi": "http://www.sat.gob.mx/cfd/4",
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      Version: "4.0",
      TipoDeComprobante: this.cfdi.getTypeCfdi(),
      Fecha: data!.fecha,
      LugarExpedicion: data!.lugarExpedicion,
      Moneda: data?.moneda ?? "MXN",
      SubTotal: Parse.parseNumber(data!.subtotal, this.currency_decimals),
      Total: Parse.parseNumber(data!.total, this.currency_decimals),
      NoCertificado: this.cfdi.getConfigCfdi().getCert().noCertificado,
      Certificado: this.getCertificado(),
      Exportacion: data?.exportacion || "01",
      ...(data?.serie && { Serie: data.serie }),
      ...(data?.folio && { Folio: data.folio }),
      ...(data?.formaPago && { FormaPago: data.formaPago }),
      ...(data?.metodoPago && { MetodoPago: data.metodoPago }),
      ...(data?.condicionesDePago && { CondicionesDePago: data.condicionesDePago }),
      ...(data?.descuento && { Descuento: Parse.parseNumber(data.descuento, this.currency_decimals) }),
      ...(data?.tipoCambio && { TipoCambio: data.tipoCambio }),
    };
    return result;
  }
  private buildNodeInformacionGlobal(): IInformacionGlobalOutput {
    return {
      Periodicidad: this.cfdi.getDataInformacionGlobal()!.periodicidad,
      Meses: this.cfdi.getDataInformacionGlobal()!.meses,
      Año: this.cfdi.getDataInformacionGlobal()!.anio,
    };
  }
  private buildNodeCfdiRelacionados(doc: XMLBuilder): void {
    const relacionados = this.cfdi.getDataCfdiRelacionados();
    if (relacionados.length === 0) return;

    for (const r of relacionados) {
      const ele_relacionados = doc.ele("cfdi:CfdiRelacionados", {
        TipoRelacion: r.tipoRelacion,
      });

      for (const uuid of r.uuids) {
        ele_relacionados.ele("cfdi:CfdiRelacionado", {
          UUID: uuid,
        });
      }
    }
  }
  private buildNodeEmisor(): INodeEmisorOutput {
    return {
      Rfc: this.cfdi.getDataEmisor()!.rfc,
      Nombre: this.cfdi.getDataEmisor()!.nombre,
      RegimenFiscal: this.cfdi.getDataEmisor()!.regimenFiscal,
      ...(this.cfdi.getDataEmisor()!.facAtrAdquirente && { FacAtrAdquirente: this.cfdi.getDataEmisor()!.facAtrAdquirente }),
    };
  }
  private buildNodeReceptor(): INodeReceptorOutput {
    return {
      Rfc: this.cfdi.getDataReceptor()!.rfc,
      Nombre: this.cfdi.getDataReceptor()!.nombre,
      DomicilioFiscal: this.cfdi.getDataReceptor()!.domicilioFiscal,
      RegimenFiscal: this.cfdi.getDataReceptor()!.regimenFiscal,
      UsoCFDI: this.cfdi.getDataReceptor()!.usoCfdi,
      ...(this.cfdi.getDataReceptor()!.residenciaFiscal && { ResidenciaFiscal: this.cfdi.getDataReceptor()!.residenciaFiscal }),
      ...(this.cfdi.getDataReceptor()!.numRegIdTrib && { NumRegIdTrib: this.cfdi.getDataReceptor()!.numRegIdTrib }),
    };
  }
  private buildNodeConceptos(doc: XMLBuilder): void {
    const ele_conceptos = doc.ele("cfdi:Conceptos");
    for (const concepto of this.cfdi.getDataConceptos()) {
      const ele_concepto = ele_conceptos.ele("cfdi:Concepto", this.buildNodeConcepto(concepto.concepto));
      if (concepto.impuestos) {
        const ele_imp = ele_concepto.ele("cfdi:Impuestos");
        if (concepto.impuestos.traslados && concepto.impuestos.traslados.length > 0) {
          const ele_traslados = ele_imp.ele("cfdi:Traslados");
          for (const traslado of concepto.impuestos.traslados) {
            ele_traslados.ele("cfdi:Traslado", this.buildNodeTR(traslado));
            this.pushConceptoWithTraslado({
              base: Parse.parseNumber(traslado.base, this.currency_decimals),
              importe: Parse.parseNumber(traslado.importe, this.currency_decimals),
              impuesto: traslado.impuesto,
              tasaOCuota: Parse.parseNumber(traslado.tasaOCuota, this.currency_decimals),
              tipoFactor: traslado.tipoFactor,
            });
          }
        }
        if (concepto.impuestos.retenciones && concepto.impuestos.retenciones.length > 0) {
          const ele_retenciones = ele_imp.ele("cfdi:Retenciones");
          for (const retencion of concepto.impuestos.retenciones) {
            ele_retenciones.ele("cfdi:Retencion", this.buildNodeTR(retencion));
            this.pushConceptoWithRetencion({
              impuesto: retencion.impuesto,
              importe: Parse.parseNumber(retencion.importe, this.currency_decimals),
            });
          }
        }
      }
      if (concepto.aCuentaTerceros) {
        ele_concepto.ele("cfdi:ACuentaTerceros", this.buildNodeACuentaTerceros(concepto.aCuentaTerceros));
      }
      if (concepto.informacionAduanera && concepto.informacionAduanera.length > 0) {
        for (const ia of concepto.informacionAduanera) {
          ele_concepto.ele("cfdi:InformacionAduanera", {
            NumeroPedimento: ia.numeroPedimento,
          });
        }
      }
      if (concepto.cuentaPredial && concepto.cuentaPredial.length > 0) {
        for (const cp of concepto.cuentaPredial) {
          ele_concepto.ele("cfdi:CuentaPredial", {
            Numero: cp.numero,
          });
        }
      }
      if (concepto.complementoConcepto && concepto.complementoConcepto.length > 0) {
        const ele_compl_conc = ele_concepto.ele("cfdi:ComplementoConcepto");
        for (const comple of concepto.complementoConcepto) {
          ele_compl_conc.ele(comple.node, comple.attributes);
        }
      }
      if (concepto.parte && concepto.parte.length > 0) {
        for (const part of concepto.parte) {
          const ele_parte = ele_concepto.ele("cfdi:Parte", this.buildNodeParte(part.concepto));
          if (part.informacionAduanera && part.informacionAduanera.length > 0) {
            for (const ia of part.informacionAduanera) {
              ele_parte.ele("cfdi:InformacionAduanera", {
                NumeroPedimento: ia.numeroPedimento,
              });
            }
          }
        }
      }
    }
  }
  private buildNodeConcepto(data: INodeConc): INodeConceptoOutput {
    return {
      ClaveProdServ: data.claveProdServ,
      Cantidad: data.cantidad,
      ClaveUnidad: data.claveUnidad,
      Descripcion: data.descripcion,
      ValorUnitario: Parse.parseNumber(data.valorUnitario, this.currency_decimals),
      Importe: Parse.parseNumber(data.importe, this.currency_decimals),
      ObjetoImp: data.objetoImp || "02",
      ...(data.unidad && { Unidad: data.unidad }),
      ...(data.noIdentificacion && { NoIdentificacion: data.noIdentificacion }),
      ...(data.descuento && { Descuento: Parse.parseNumber(data.descuento, this.currency_decimals) }),
    };
  }
  private buildNodeTR(data: INodeImpuestos): INodeImpuestosOutput {
    return {
      Base: Parse.parseNumber(data.base, this.currency_decimals),
      Impuesto: data.impuesto,
      TipoFactor: data.tipoFactor,
      ...(data.tasaOCuota && { TasaOCuota: Parse.parseNumber(data.tasaOCuota, this.currency_decimals) }),
      ...(data.importe !== undefined && { Importe: Parse.parseNumber(data.importe, this.currency_decimals) }),
    };
  }
  private buildNodeACuentaTerceros(data: INodeACuentaTerceros): INodeACuentaTercerosOutput {
    return {
      DomicilioFiscalACuentaTerceros: data.domicilioFiscalACuentaTerceros,
      NombreACuentaTerceros: data.nombreACuentaTerceros,
      RegimenFiscalACuentaTerceros: data.regimenFiscalACuentaTerceros,
      RfcACuentaTerceros: data.rfcACuentaTerceros,
    };
  }
  private buildNodeParte(data: INodeConcParte): INodeParteOutput {
    return {
      ClaveProdServ: data.claveProdServ,
      Cantidad: data.cantidad,
      Descripcion: data.descripcion,
      ...(data.noIdentificacion && { NoIdentificacion: data.noIdentificacion }),
      ...(data.unidad && { Unidad: data.unidad }),
      ...(data.valorUnitario !== undefined && { ValorUnitario: Parse.parseNumber(data.valorUnitario, this.currency_decimals) }),
      ...(data.importe !== undefined && { Importe: Parse.parseNumber(data.importe, this.currency_decimals) }),
    };
  }
  private buildNodeImpuestos(doc: XMLBuilder): void {
    if (this.conceptos_with_traslado.length > 0 || this.conceptos_with_retencion.length > 0) {
      const ele_impuestos = doc.ele("cfdi:Impuestos", {
        ...(this.conceptos_with_traslado.length > 0 && {
          TotalImpuestosTrasladados: Parse.parseNumber(
            this.conceptos_with_traslado.reduce((acc, curr) => acc + (Number(curr.importe) || 0), 0),
            this.currency_decimals
          ),
        }),
        ...(this.conceptos_with_retencion.length > 0 && {
          TotalImpuestosRetenidos: Parse.parseNumber(
            this.conceptos_with_retencion.reduce((acc, curr) => acc + (Number(curr.importe) || 0), 0),
            this.currency_decimals
          ),
        }),
      });
      if (this.conceptos_with_traslado.length > 0) {
        const ele_ret = ele_impuestos.ele("cfdi:Traslados");
        for (const t of this.conceptos_with_traslado) {
          ele_ret.ele("cfdi:Traslado", {
            Base: Parse.parseNumber(Number(t.base), this.currency_decimals),
            Impuesto: t.impuesto,
            TipoFactor: t.tipoFactor,
            ...(t.tasaOCuota && { TasaOCuota: Parse.parseNumber(Number(t.tasaOCuota), this.currency_decimals) }),
            ...(t.importe !== undefined && { Importe: Parse.parseNumber(Number(t.importe), this.currency_decimals) }),
          });
        }
      }
      if (this.conceptos_with_retencion.length > 0) {
        const ele_ret = ele_impuestos.ele("cfdi:Retenciones");
        for (const r of this.conceptos_with_retencion) {
          ele_ret.ele("cfdi:Retencion", {
            Impuesto: r.impuesto,
            ...(r.importe !== undefined && { Importe: Parse.parseNumber(Number(r.importe), this.currency_decimals) }),
          });
        }
      }
    }
  }
  private buildNodeAddenda(doc: XMLBuilder): void {
    const addendaData = this.cfdi.getDataAddenda();
    if (!addendaData) return;

    const node_addenda = doc.ele("cfdi:Addenda").ele(addendaData.nodeBase, addendaData.attributes);
    if (addendaData.content) {
      node_addenda.txt(addendaData.content);
    }
    if (addendaData.nodes && addendaData.nodes.length > 0) {
      for (const node of addendaData.nodes) {
        const addendaNode = node_addenda.ele(node.nodeName);
        if (node.content) {
          addendaNode.txt(node.content.toString());
        }
        if (node.nodes && node.nodes.length > 0) {
          for (const child of node.nodes) {
            const childNode = addendaNode.ele(child.nodeName);
            if (child.content) {
              childNode.txt(child.content.toString());
            }
          }
        }
      }
    }
  }

  private pushConceptoWithTraslado(concepto: TConceptoWithTraslado): void {
    this.conceptos_with_traslado.push(concepto);
  }
  private pushConceptoWithRetencion(concepto: TConceptoWithRetencion): void {
    this.conceptos_with_retencion.push(concepto);
  }
  private getCertificado(): string {
    return this.cfdi
      .getConfigCfdi()
      .getCert()
      .pem.replace("-----BEGIN CERTIFICATE-----", "")
      .replace("-----END CERTIFICATE-----", "")
      .replace(/(\r\n|\n|\r)/gm, "");
  }
}
export default CfdiBuilder;
