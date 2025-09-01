import {
  INodeACuentaTerceros,
  INodeAddenda,
  INodeComprobante,
  INodeConc,
  INodeConcepto,
  INodeConcParte,
  INodeEmisor,
  INodeInformacionGlobal,
  INodeReceptor,
  INodeRelacionados,
  INodeRetencion,
  INodeTraslado,
  IObjectNodeACuentaTerceros,
  IObjectNodeComprobante,
  IObjectNodeConcepto,
  IObjectNodeEmisor,
  IObjectNodeParte,
  IObjectNodeReceptor,
  IObjectNodeRetencion,
  IObjectNodeTraslado,
} from "../interfaces/IFacturaCfdi";
import ConfigCfdi from "./ConfigCfdi";
import { create } from "xmlbuilder2";
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import generateCadenaOriginal from "../utils/generateCadenaOriginal";
import Utils from "./Utils";
import ValidatorFacturaCfdi from "./ValidatorFacturaCfdi";

class FacturaCfdi extends Utils {
  private readonly config_cfdi: ConfigCfdi;
  private node_comprobante: INodeComprobante = {
    serie: "",
    folio: "",
    fecha: "",
    subtotal: "",
    formaPago: "",
    total: "",
    metodoPago: "PUE",
    lugarExpedicion: "",
  };
  private node_informacion_global: INodeInformacionGlobal = {
    exist: false,
    periodicidad: "01",
    meses: "01",
    anio: "",
  };
  private readonly node_relacionados: INodeRelacionados[] = [];
  private node_emisor: INodeEmisor = {
    rfc: "",
    nombre: "",
    regimenFiscal: "",
  };
  private node_receptor: INodeReceptor = {
    rfc: "",
    nombre: "",
    usoCfdi: "",
    domicilioFiscal: "",
    regimenFiscal: "",
  };
  private readonly node_conceptos: INodeConcepto[] = [];
  private node_addendas: INodeAddenda = {
    nodeBase: "",
    attributes: {},
  };
  constructor(config_cfdi: ConfigCfdi) {
    super();
    this.config_cfdi = config_cfdi;
  }
  public createNodeComprobante(options: INodeComprobante) {
    const instance = new ValidatorFacturaCfdi<INodeComprobante>("comprobante", options);
    instance
      .run()
      .then(() => {
        const errors = instance.getErrors();
        if (errors.length > 0) {
          const err = `Exist an error at createNodeComprobante: ${errors[0].code}: ${errors[0].message}`;
          throw new Error(err);
        }
      })
      .catch((err) => {
        throw new Error(err.message);
      });
    this.node_comprobante = options;
  }
  public createNodeInformacionGlobal(options: INodeInformacionGlobal) {
    this.node_informacion_global = options;
    this.node_informacion_global.exist = true;
  }
  public createNodeRelacionados(options: INodeRelacionados) {
    this.node_relacionados.push(options);
  }
  public createNodeEmisor(options: INodeEmisor) {
    this.node_emisor = options;
  }
  public createNodeReceptor(options: INodeReceptor) {
    this.node_receptor = options;
  }
  public createNodeConcepto(options: INodeConcepto) {
    this.node_conceptos.push(options);
  }
  public createNodeAddenda(options: INodeAddenda) {
    this.node_addendas = options;
  }
  public createXml(): string {
    return this.generateXml();
  }
  public createJson(simplified = false) {
    const xml = this.createXml();
    const json = Utils.xmlToJson(xml);
    return simplified ? this.simplifyJson(json) : json;
  }
  public async createXmlSellado() {
    const xml = this.generateXml();
    return generateCadenaOriginal(xml, this.config_cfdi)
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
  public async createJsonSellado(simplified = false) {
    const xml = await this.createXmlSellado();
    const json = Utils.xmlToJson(xml);
    return simplified ? this.simplifyJson(json) : json;
  }
  private generateXml(): string {
    const doc = create({
      version: "1.0",
    }).ele("cfdi:Comprobante", this.generateNodeComprobante());
    if (this.node_informacion_global.exist) {
      doc.ele("cfdi:InformacionGlobal", {
        Periodicidad: this.node_informacion_global.periodicidad,
        Meses: this.node_informacion_global.meses,
        Año: this.node_informacion_global.anio,
      });
    }
    if (this.node_relacionados.length > 0) {
      for (const relation of this.node_relacionados) {
        const ele_relacionados = doc.ele("cfdi:CfdiRelacionados", {
          TipoRelacion: relation.tipoRelacion,
        });
        for (const uuid of relation.uuids) {
          ele_relacionados.ele("cfdi:CfdiRelacionado", {
            UUID: uuid,
          });
        }
      }
    }
    doc.ele("cfdi:Emisor", this.generateNodeEmisor());
    doc.ele("cfdi:Receptor", this.generateNodeReceptor());
    const ele_conceptos = doc.ele("cfdi:Conceptos");
    for (const concepto of this.node_conceptos) {
      const ele_concepto = ele_conceptos.ele("cfdi:Concepto", this.generateNodeConcepto(concepto.concepto));
      if ("impuestos" in concepto && concepto.concepto.objetoImp !== "01") {
        const ele_imp = ele_concepto.ele("cfdi:Impuestos");
        if ("traslados" in concepto.impuestos! && concepto.impuestos.traslados!.length > 0) {
          const ele_tras = ele_imp.ele("cfdi:Traslados");
          for (const traslado of concepto.impuestos.traslados!) {
            ele_tras.ele("cfdi:Traslado", this.generateNodeTraslado(traslado));
          }
        }
        if ("retenciones" in concepto.impuestos! && concepto.impuestos.retenciones!.length > 0) {
          const ele_ret = ele_imp.ele("cfdi:Retenciones");
          for (const retencion of concepto.impuestos.retenciones!) {
            ele_ret.ele("cfdi:Retencion", this.generateNodeRetencion(retencion));
          }
        }
      }
      if ("aCuentaTerceros" in concepto) {
        ele_concepto.ele("cfdi:ACuentaTerceros", this.generateNodeACuentaTerceros(concepto.aCuentaTerceros!));
      }
      if ("informacionAduanera" in concepto && concepto.informacionAduanera!.length > 0) {
        for (const ia of concepto.informacionAduanera!) {
          ele_concepto.ele("cfdi:InformacionAduanera", {
            NumeroPedimento: ia.numeroPedimento,
          });
        }
      }
      if ("cuentaPredial" in concepto && concepto.cuentaPredial!.length > 0) {
        for (const cp of concepto.cuentaPredial!) {
          ele_concepto.ele("cfdi:CuentaPredial", {
            Numero: cp.numero,
          });
        }
      }
      if ("complementoConcepto" in concepto && concepto.complementoConcepto!.length > 0) {
        const ele_compl_conc = ele_concepto.ele("cfdi:ComplementoConcepto");
        for (const comple of concepto.complementoConcepto!) {
          ele_compl_conc.ele(comple.node, comple.attributes);
        }
      }
      if ("parte" in concepto && concepto.parte!.length > 0) {
        for (const part of concepto.parte!) {
          const ele_parte = ele_concepto.ele("cfdi:Parte", this.generateNodeParte(part.concepto));
          if ("informacionAduanera" in part && part.informacionAduanera!.length > 0) {
            for (const ia of part.informacionAduanera!) {
              ele_parte.ele("cfdi:InformacionAduanera", {
                NumeroPedimento: ia.numeroPedimento,
              });
            }
          }
        }
      }
    }
    const createNodeImpuestos = this.createNodeImpuestos();

    if (createNodeImpuestos.total_impuestos_retenidos.total > 0 || createNodeImpuestos.total_impuestos_trasladados.total > 0) {
      const ele_impuestos = doc.ele("cfdi:Impuestos", {
        TotalImpuestosRetenidos: createNodeImpuestos.total_impuestos_retenidos.total.toFixed(2),
        TotalImpuestosTrasladados: createNodeImpuestos.total_impuestos_trasladados.total.toFixed(2),
      });
      if (createNodeImpuestos.total_impuestos_retenidos.data.length > 0) {
        const ele_ret = ele_impuestos.ele("cfdi:Retenciones");
        for (const ret of createNodeImpuestos.total_impuestos_retenidos.data) {
          ele_ret.ele("cfdi:Retencion", {
            Importe: ret.importe,
            Impuesto: ret.impuesto,
          });
        }
      }
      if (createNodeImpuestos.total_impuestos_trasladados.data.length > 0) {
        const ele_tras = ele_impuestos.ele("cfdi:Traslados");
        for (const tras of createNodeImpuestos.total_impuestos_trasladados.data) {
          ele_tras.ele("cfdi:Traslado", {
            Base: tras.base,
            Impuesto: tras.impuesto,
            TipoFactor: tras.tipoFactor,
            TasaOCuota: parseFloat(tras.tasaOCuota).toFixed(6),
            Importe: tras.importe,
          });
        }
      }
    }
    if (this.node_addendas.nodeBase !== "") {
      const node_addenda = doc.ele("cfdi:Addenda").ele(this.node_addendas.nodeBase, this.node_addendas.attributes);

      if ("content" in this.node_addendas && this.node_addendas.content! !== "" && !("nodes" in this.node_addendas)) {
        node_addenda.txt(this.node_addendas.content!);
      }
      if ("nodes" in this.node_addendas && this.node_addendas.nodes!.length > 0 && !("content" in this.node_addendas)) {
        for (const node of this.node_addendas.nodes!) {
          const addenda = node_addenda.ele(node.nodeName);

          if ("content" in node && node.content !== "" && !("nodes" in node)) {
            addenda.txt(node.content!.toString());
          }
          if ("nodes" in node && node.nodes!.length > 0 && !("content" in node)) {
            for (const a of node.nodes!) {
              addenda.ele(a.nodeName).txt(a.content.toString());
            }
          }
        }
      }
    }

    return doc.end({ prettyPrint: true });
  }
  private generateNodeComprobante() {
    const node_comprobante: IObjectNodeComprobante = {
      "xsi:schemaLocation": "http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd",
      "xmlns:cfdi": "http://www.sat.gob.mx/cfd/4",
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      Version: "4.0",
      Serie: this.node_comprobante.serie,
      Folio: this.node_comprobante.folio,
      Fecha: this.node_comprobante.fecha,
      SubTotal: ["P", "T"].includes(this.node_comprobante.tipoDeComprobante ?? "I") ? "0" : parseFloat(this.node_comprobante.subtotal.toString()).toFixed(2),
      Moneda: this.node_comprobante.moneda ?? "MXN",
      Total: ["P", "T"].includes(this.node_comprobante.tipoDeComprobante ?? "I") ? "0" : parseFloat(this.node_comprobante.total.toString()).toFixed(2),
      TipoDeComprobante: this.node_comprobante.tipoDeComprobante ?? "I",
      LugarExpedicion: this.node_comprobante.lugarExpedicion,
      NoCertificado: this.config_cfdi.getCert().noCertificado,
      Certificado: this.config_cfdi
        .getCert()
        .pem.replace("-----BEGIN CERTIFICATE-----", "")
        .replace("-----END CERTIFICATE-----", "")
        .replace(/(\r\n|\n|\r)/gm, ""),
      Exportacion: this.node_comprobante.exportacion ?? "01",
    };
    if ("formaPago" in this.node_comprobante && !["T", "P"].includes(this.node_comprobante.tipoDeComprobante!)) {
      node_comprobante.FormaPago = this.node_comprobante.formaPago;
    }
    if ("metodoPago" in this.node_comprobante && !["T", "P"].includes(this.node_comprobante.tipoDeComprobante!)) {
      node_comprobante.MetodoPago = this.node_comprobante.metodoPago;
    }
    if ("tipoCambio" in this.node_comprobante && node_comprobante.Moneda !== "MXN") {
      node_comprobante.TipoCambio = this.node_comprobante.tipoCambio;
    }
    if ("condicionesDePago" in this.node_comprobante && !["P"].includes(this.node_comprobante.tipoDeComprobante!)) {
      node_comprobante.CondicionesDePago = this.node_comprobante.condicionesDePago;
    }
    if (
      "descuento" in this.node_comprobante &&
      parseFloat(this.node_comprobante.descuento!.toString()) > 0 &&
      !["P"].includes(this.node_comprobante.tipoDeComprobante!)
    ) {
      node_comprobante.Descuento = this.node_comprobante.descuento;
    }
    return node_comprobante;
  }
  private generateNodeEmisor(): IObjectNodeEmisor {
    const node_attr: IObjectNodeEmisor = {
      Rfc: this.node_emisor.rfc,
      Nombre: this.node_emisor.nombre,
      RegimenFiscal: this.node_emisor.regimenFiscal,
    };
    if ("facAtrAdquirente" in this.node_emisor) {
      node_attr.FacAtrAdquirente = this.node_emisor.facAtrAdquirente!.padStart(10, "0");
    }
    return node_attr;
  }
  private generateNodeReceptor(): IObjectNodeReceptor {
    const node_attr: IObjectNodeReceptor = {
      Rfc: this.node_receptor.rfc,
      Nombre: this.node_receptor.nombre,
      UsoCFDI: this.node_receptor.usoCfdi,
      DomicilioFiscalReceptor: this.node_receptor.domicilioFiscal,
      RegimenFiscalReceptor: this.node_receptor.regimenFiscal,
    };
    if ("residenciaFiscal" in this.node_receptor) {
      node_attr.ResidenciaFiscal = this.node_receptor.residenciaFiscal;
    }
    if ("numRegIdTrib" in this.node_receptor) {
      node_attr.NumRegIdTrib = this.node_receptor.numRegIdTrib;
    }
    return node_attr;
  }
  private generateNodeConcepto(concepto: INodeConc) {
    const node_attr: IObjectNodeConcepto = {
      ClaveProdServ: concepto.claveProdServ,
      Cantidad: concepto.cantidad,
      ClaveUnidad: concepto.claveUnidad,
      Descripcion: concepto.descripcion,
      Importe: this.node_comprobante.tipoDeComprobante === "P" ? "0" : parseFloat(concepto.importe).toFixed(2),
      ObjetoImp: concepto.objetoImp ?? "02",
      ValorUnitario: this.node_comprobante.tipoDeComprobante === "P" ? "0" : parseFloat(concepto.valorUnitario.toString()).toFixed(2),
    };
    if ("unidad" in concepto) {
      node_attr.Unidad = concepto.unidad;
    }
    if ("noIdentificacion" in concepto) {
      node_attr.NoIdentificacion = concepto.noIdentificacion;
    }
    if ("descuento" in concepto && parseFloat(concepto.descuento!) > 0) {
      node_attr.Descuento = parseFloat(concepto.descuento!).toFixed(2);
    }
    return node_attr;
  }
  private generateNodeTraslado(traslado: INodeTraslado): IObjectNodeTraslado {
    const node_attr: IObjectNodeTraslado = {
      Base: parseFloat(traslado.base.toString()).toFixed(2),
      Impuesto: traslado.impuesto,
      TipoFactor: traslado.tipoFactor,
    };
    if ("tasaOCuota" in traslado) {
      node_attr.TasaOCuota = parseFloat(traslado.tasaOCuota!.toString()).toFixed(6);
    }
    if ("importe" in traslado) {
      node_attr.Importe = parseFloat(traslado.importe!.toString()).toFixed(2);
    }
    return node_attr;
  }
  private generateNodeRetencion(retencion: INodeRetencion): IObjectNodeRetencion {
    const node_attr: IObjectNodeRetencion = {
      Base: parseFloat(retencion.base.toString()).toFixed(2),
      Impuesto: retencion.impuesto,
      TipoFactor: retencion.tipoFactor,
    };
    if ("tasaOCuota" in retencion) {
      node_attr.TasaOCuota = parseFloat(retencion.tasaOCuota!.toString()).toFixed(6);
    }
    if ("importe" in retencion) {
      node_attr.Importe = parseFloat(retencion.importe!.toString()).toFixed(2);
    }
    return node_attr;
  }
  private generateNodeACuentaTerceros(aCuentaTerceros: INodeACuentaTerceros): IObjectNodeACuentaTerceros {
    return {
      RfcACuentaTerceros: aCuentaTerceros.rfcACuentaTerceros,
      NombreACuentaTerceros: aCuentaTerceros.nombreACuentaTerceros,
      DomicilioFiscalACuentaTerceros: aCuentaTerceros.domicilioFiscalACuentaTerceros,
      RegimenFiscalACuentaTerceros: aCuentaTerceros.regimenFiscalACuentaTerceros,
    };
  }
  private generateNodeParte(parte: INodeConcParte): IObjectNodeParte {
    const node_attr: IObjectNodeParte = {
      Cantidad: parte.cantidad,
      ClaveProdServ: parte.claveProdServ,
      Descripcion: parte.descripcion,
    };
    if ("unidad" in parte) {
      node_attr.Unidad = parte.unidad;
    }
    if ("noIdentificacion" in parte) {
      node_attr.NoIdentificacion = parte.noIdentificacion;
    }
    if ("valorUnitario" in parte && parseFloat(parte.valorUnitario!) > 0) {
      node_attr.ValorUnitario = parseFloat(parte.valorUnitario!).toFixed(2);
    }
    if ("importe" in parte && parseFloat(parte.importe!) > 0) {
      node_attr.Importe = parseFloat(parte.importe!).toFixed(2);
    }
    return node_attr;
  }
  private createNodeImpuestos() {
    const imp_obj = {
      total_impuestos_retenidos: {
        total: 0,
        data: [] as { importe: string; impuesto: string }[],
      },
      total_impuestos_trasladados: {
        total: 0,
        data: [] as { base: string; importe: string; impuesto: string; tasaOCuota: string; tipoFactor: string }[],
      },
    };
    for (const concepto of this.node_conceptos) {
      if ("impuestos" in concepto && concepto.concepto.objetoImp !== "01") {
        if ("traslados" in concepto.impuestos! && concepto.impuestos.traslados!.length > 0) {
          imp_obj.total_impuestos_trasladados.data.push(
            ...concepto.impuestos.traslados!.map((traslado) => {
              const node_attr: any = {
                base: parseFloat(traslado.base.toString()).toFixed(2),
                impuesto: traslado.impuesto,
                tipoFactor: traslado.tipoFactor,
              };
              if ("tasaOCuota" in traslado) {
                node_attr.tasaOCuota = parseFloat(traslado.tasaOCuota!.toString()).toFixed(6);
              }
              if ("importe" in traslado) {
                node_attr.importe = parseFloat(traslado.importe!.toString()).toFixed(2);
                imp_obj.total_impuestos_trasladados.total += parseFloat(traslado.importe!.toString());
              }

              return node_attr;
            })
          );
        }
        if ("retenciones" in concepto.impuestos! && concepto.impuestos.retenciones!.length > 0) {
          imp_obj.total_impuestos_retenidos.data.push(
            ...concepto.impuestos.retenciones!.map((retencion) => {
              const node_attr: any = {
                impuesto: retencion.impuesto,
              };
              if ("importe" in retencion) {
                node_attr.importe = parseFloat(retencion.importe!.toString()).toFixed(2);
                imp_obj.total_impuestos_retenidos.total += parseFloat(retencion.importe!.toString());
              }
              return node_attr;
            })
          );
        }
      }
    }
    return imp_obj;
  }
}
export default FacturaCfdi;
