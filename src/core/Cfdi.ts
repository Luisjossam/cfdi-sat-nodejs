import ConfigCfdi from "../classes/ConfigCfdi";
import {
  ICfdi,
  INodeAddenda,
  INodeComprobante,
  INodeConcepto,
  INodeEmisor,
  INodeInformacionGlobal,
  INodeReceptor,
  INodeRelacionados,
} from "../interfaces/ICfdi";
import { TComprobantes } from "../types/TComprobantes";
import Builder from "./builders/CfdiBuilder";

abstract class Cfdi implements ICfdi {
  private data_comprobante: INodeComprobante | undefined;
  private data_emisor: INodeEmisor | undefined;
  private data_receptor: INodeReceptor | undefined;
  private readonly data_conceptos: INodeConcepto[] = [];
  private readonly data_cfdi_relacionados: INodeRelacionados[] = [];
  private data_addenda: INodeAddenda | undefined;
  private data_informacion_global: INodeInformacionGlobal | undefined;
  constructor(private readonly type_cfdi: TComprobantes, protected readonly config_cfdi: ConfigCfdi) {}
  public setNodeComprobante(data: INodeComprobante): void {
    this.data_comprobante = data;
  }
  public createNodeRelacionados(data: INodeRelacionados): void {
    this.data_cfdi_relacionados.push(data);
  }
  public createNodeEmisor(data: INodeEmisor): void {
    this.data_emisor = data;
  }
  public createNodeReceptor(data: INodeReceptor): void {
    this.data_receptor = data;
  }
  public pushNodeConcepto(data: INodeConcepto): void {
    this.data_conceptos.push(data);
  }
  public createNodeAddenda(data: INodeAddenda): void {
    this.data_addenda = data;
  }
  public setNodeInformacionGlobal(data: INodeInformacionGlobal): void {
    this.data_informacion_global = data;
  }
  public getTypeCfdi(): TComprobantes {
    return this.type_cfdi;
  }
  public getConfigCfdi(): ConfigCfdi {
    return this.config_cfdi;
  }
  public getDataComprobante(): INodeComprobante | undefined {
    return this.data_comprobante;
  }
  public getDataCfdiRelacionados(): INodeRelacionados[] {
    return this.data_cfdi_relacionados;
  }
  public getDataEmisor(): INodeEmisor | undefined {
    return this.data_emisor;
  }
  public getDataReceptor(): INodeReceptor | undefined {
    return this.data_receptor;
  }
  public getDataConceptos(): INodeConcepto[] {
    return this.data_conceptos;
  }
  public getDataAddenda(): INodeAddenda | undefined {
    return this.data_addenda;
  }
  public getDataInformacionGlobal(): INodeInformacionGlobal | undefined {
    return this.data_informacion_global;
  }
  public async createXml(): Promise<string> {
    return await new Builder(this).buildXml();
  }
  public async createXmlSellado(): Promise<string> {
    return await new Builder(this).buildXmlSellado();
  }
  public async createJson(simplified: boolean = false): Promise<Record<string, string>> {
    return await new Builder(this).buildJson(simplified);
  }
  public async createJsonSellado(simplified: boolean = false): Promise<Record<string, string>> {
    return await new Builder(this).buildJsonSellado(simplified);
  }
}
export default Cfdi;
