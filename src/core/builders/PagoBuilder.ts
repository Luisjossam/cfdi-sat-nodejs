import ConfigCfdi from "../../classes/ConfigCfdi";
import Utils from "../../classes/Utils";
import {
  IDocRelacionado,
  IDocRelRetenciones,
  IDocRelTraslado,
  INodePago,
  INodeTotales,
  IObjectDocRelTraslado,
  IObjectNodeDocRela,
  IObjectNodeImp,
  IObjectNodePago,
  IObjectNodePagos,
  IObjectNodeTotales,
} from "../../interfaces/IPagos";
import generateCadenaOriginal from "../../utils/generateCadenaOriginal";
import { doc_relacionado_keys, pagos_keys, totales_keys } from "../../utils/pagos";

class PagoBuilder {
  private readonly retenciones: IDocRelRetenciones[] = [];
  private traslados: IDocRelTraslado[] = [];
  constructor(private readonly cfdi: Record<string, string>, private readonly data_totales: INodeTotales, private readonly data_pagos: INodePago[]) {}
  public createXml(): string {
    const cfdi = this.updateCfdi();
    return Utils.jsonToXml(cfdi);
  }
  public async createXmlSellado(config_cfdi: ConfigCfdi): Promise<string> {
    const json = await this.generateJsonSellado(config_cfdi);
    return Utils.jsonToXml(json);
  }
  public createJson(simplified?: boolean): Record<string, string> {
    const json = this.updateCfdi();
    return simplified ? new Utils().simplifyJson(json) : json;
  }
  public async createJsonSellado(config_cfdi: ConfigCfdi, simplified?: boolean): Promise<Record<string, string>> {
    const json = await this.generateJsonSellado(config_cfdi);
    return simplified ? new Utils().simplifyJson(json) : json;
  }
  private async generateJsonSellado(config_cfdi: ConfigCfdi): Promise<any> {
    const cfdi = this.updateCfdi();
    const x = cfdi["?xml"];
    const { ["?xml"]: _omit, ...rest } = cfdi;
    const sign = await generateCadenaOriginal(rest, config_cfdi);
    (rest["cfdi:Comprobante"] as any)["@_Sello"] = sign;
    return { "?xml": x, ...rest };
  }
  private updateCfdi(): Record<string, string> {
    let json = this.cfdi as any;
    json["cfdi:Comprobante"][
      "@_xsi:schemaLocation"
    ] = `${json["cfdi:Comprobante"]["@_xsi:schemaLocation"]} http://www.sat.gob.mx/Pagos20 http://www.sat.gob.mx/sitio_internet/cfd/Pagos/Pagos20.xsd`;
    json["cfdi:Comprobante"]["@_xmlns:pago20"] = "http://www.sat.gob.mx/Pagos20";
    const nodePagoAttrs = this.generateAttribute();
    if (!json["cfdi:Comprobante"]["cfdi:Complemento"]) {
      json["cfdi:Comprobante"]["cfdi:Complemento"] = {
        "pago20:Pagos": nodePagoAttrs,
      };
    } else {
      Object.assign(json["cfdi:Comprobante"]["cfdi:Complemento"], {
        "pago20:Pagos": nodePagoAttrs,
      });
    }
    return json;
  }
  private generateAttribute(): IObjectNodePagos {
    const att: IObjectNodePagos = {
      "@_Version": "2.0",
      "pago20:Totales": this.generateNodeTotales(),
      "pago20:Pago": this.data_pagos.map((p) => this.generateNodePago(p)),
    };
    return att;
  }
  private generateNodeTotales(): IObjectNodeTotales {
    const node = {} as Partial<IObjectNodeTotales>;
    for (const tk of totales_keys) {
      if (this.data_totales[tk.entrada] != null) {
        node[tk.salida] = parseFloat(this.data_totales[tk.entrada]!.toString()).toFixed(2) as any;
      }
    }
    return node as IObjectNodeTotales;
  }
  private generateNodePago(data: INodePago): IObjectNodePago {
    const node = {} as Partial<IObjectNodePago>;
    for (const pk of pagos_keys) {
      if (data.pago[pk.entrada]) {
        node[pk.salida] = pk.entrada === "monto" ? parseFloat(data.pago[pk.entrada].toString()).toFixed(2) : (data.pago[pk.entrada] as any);
      }
    }
    if ("doctoRelacionados" in data) {
      node["pago20:DoctoRelacionado"] = data.doctoRelacionados.map((dr) => this.generateDoctoRelacionado(dr));
    }
    if (this.retenciones.length > 0 || this.traslados.length > 0) {
      node["pago20:ImpuestosP"] = {};

      if (this.retenciones.length > 0) {
        node["pago20:ImpuestosP"]["pago20:RetencionesP"] = {
          "pago20:RetencionP": this.retenciones.map((r) => ({
            "@_ImpuestoP": r.impuestoDr,
            "@_ImporteP": parseFloat(r.importeDr.toString()).toFixed(2),
          })),
        };
      }
      if (this.traslados.length > 0) {
        node["pago20:ImpuestosP"]["pago20:TrasladosP"] = {
          "pago20:TrasladoP": this.traslados.map((t) => {
            const att: any = {
              "@_BaseP": parseFloat(t.baseDr.toString()).toFixed(2),
              "@_ImpuestoP": t.impuestoDr,
              "@_TipoFactorP": t.tipoFactorDr,
            };
            if ("tasaOCuotaDr" in t) {
              att["@_TasaOCuotaP"] = parseFloat(t.tasaOCuotaDr!.toString()).toFixed(2);
            }
            if ("importeDr" in t) {
              att["@_ImporteP"] = parseFloat(t.importeDr!.toString()).toFixed(2);
            }
            return att;
          }),
        };
      }
    }
    return node as IObjectNodePago;
  }
  private generateDoctoRelacionado(data: IDocRelacionado): IObjectNodeDocRela {
    const node = {} as Partial<IObjectNodeDocRela>;
    for (const drk of doc_relacionado_keys) {
      if (data.doctoRelacionado[drk.entrada] != null) {
        node[drk.salida] =
          drk.entrada !== "equivalenciaDr" && typeof data.doctoRelacionado[drk.entrada] !== "string"
            ? parseFloat(data.doctoRelacionado[drk.entrada]!.toString()).toFixed(2)
            : (data.doctoRelacionado[drk.entrada] as any);
      }
    }
    if ("impuestos" in data) {
      node["pago20:ImpuestosDR"] = this.generateNodeImpuestos(data.impuestos);
    }
    return node as IObjectNodeDocRela;
  }
  private generateNodeImpuestos(data: { retenciones?: IDocRelRetenciones[]; traslados?: IDocRelTraslado[] }) {
    const node = {} as Partial<IObjectNodeImp>;
    if ("retenciones" in data && data.retenciones!.length > 0) {
      node["pago20:RetencionesDR"] = {
        "pago20:RetencionDR": data.retenciones!.map((r) => {
          const retencion_index = this.retenciones.findIndex((aR) => aR.impuestoDr === r.impuestoDr);
          if (retencion_index > -1) {
            this.retenciones[retencion_index].importeDr =
              parseFloat(this.retenciones[retencion_index].importeDr.toString()) + parseFloat(r.importeDr.toString());
          } else {
            this.retenciones.push(r);
          }
          return {
            "@_BaseDR": parseFloat(r.baseDr.toString()).toFixed(2),
            "@_ImpuestoDR": r.impuestoDr,
            "@_TipoFactorDR": r.tipoFactorDr,
            "@_TasaOCuotaDR": parseFloat(r.tasaOCuotaDr.toString()).toFixed(2),
            "@_ImporteDR": parseFloat(r.importeDr.toString()).toFixed(2),
          };
        }),
      };
    }
    if ("traslados" in data && data.traslados!.length > 0) {
      this.traslados = data.traslados!;
      node["pago20:TrasladosDR"] = {
        "pago20:TrasladoDR": data.traslados!.map((t) => {
          const n_traslado: IObjectDocRelTraslado = {
            "@_BaseDR": parseFloat(t.baseDr.toString()).toFixed(2),
            "@_ImpuestoDR": t.impuestoDr,
            "@_TipoFactorDR": t.tipoFactorDr,
          };
          if ("tasaOCuotaDr" in t) {
            n_traslado["@_TasaOCuotaDR"] = parseFloat(t.tasaOCuotaDr!.toString()).toFixed(2);
          }
          if ("importeDr" in t) {
            n_traslado["@_ImporteDR"] = parseFloat(t.importeDr!.toString()).toFixed(2);
          }
          return n_traslado;
        }),
      };
    }
    return node as IObjectNodeImp;
  }
}
export default PagoBuilder;
