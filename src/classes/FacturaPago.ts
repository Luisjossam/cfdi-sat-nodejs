import PagoBuilder from "../core/builders/PagoBuilder";
import Cfdi from "../core/Cfdi";
import { ICfdi } from "../interfaces/ICfdi";
import { IFacturaPago, INodeComprobante } from "../interfaces/IFacturaPago";
import { INodePago, INodeTotales } from "../interfaces/IPagos";
import ConfigCfdi from "./ConfigCfdi";

class FacturaPago extends Cfdi implements IFacturaPago {
  private data_totales: INodeTotales | undefined;
  private data_pago: INodePago[] = [];
  constructor(readonly config_cfdi: ConfigCfdi) {
    super("P", config_cfdi);
    const values = {
      concepto: {
        cantidad: 1,
        claveProdServ: "84111506",
        claveUnidad: "ACT",
        descripcion: "Pago",
        valorUnitario: 0,
        importe: 0,
        objetoImp: "01" as const,
      },
    };
    this.pushNodeConcepto(values);
  }
  public createNodeComprobante(data: INodeComprobante): void {
    const values = {
      ...data,
      moneda: "XXX",
      total: 0,
      subtotal: 0,
      exportacion: "01",
    };
    this.setNodeComprobante(values);
  }
  public createNodeTotales(data: INodeTotales): void {
    this.data_totales = data;
  }
  public createNodePago(data: INodePago): void {
    this.data_pago.push(data);
  }
  override async createXml(): Promise<string> {
    const json = await super.createJson();
    // agreagar valdiador para que el total no vayan como undefined
    return new PagoBuilder(json, this.data_totales!, this.data_pago).createXml();
  }
  override async createXmlSellado(): Promise<string> {
    const json = await super.createJson();
    const xml = await new PagoBuilder(json, this.data_totales!, this.data_pago).createXmlSellado(this.config_cfdi);
    return xml;
  }
  override async createJson(simplified?: boolean): Promise<Record<string, string>> {
    const json = await super.createJson();
    return new PagoBuilder(json, this.data_totales!, this.data_pago).createJson(simplified);
  }
  override async createJsonSellado(simplified?: boolean): Promise<Record<string, string>> {
    const json = await super.createJson();
    const xml = await new PagoBuilder(json, this.data_totales!, this.data_pago).createJsonSellado(this.config_cfdi, simplified);
    return xml;
  }
}
export default FacturaPago as unknown as { new (config_cfdi: ConfigCfdi): ICfdi & IFacturaPago };
