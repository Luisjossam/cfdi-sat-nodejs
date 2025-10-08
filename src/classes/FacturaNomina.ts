import Cfdi from "../core/Cfdi";
import { ICfdi, INodeComprobante as INC } from "../interfaces/ICfdi";
import {
  IFacturaNomina,
  INodeComprobante,
  INodeConcepto,
  INodeNomina,
  INodeNominaDeducciones,
  INodeNominaEmisor,
  INodeNominaPercepciones,
  INodeNominaReceptor,
} from "../interfaces/IFacturaNomina";
import ConfigCfdi from "./ConfigCfdi";

class FacturaNomina extends Cfdi implements IFacturaNomina {
  private data_nomina: INodeNomina | undefined;
  private data_nomina_emisor: INodeNominaEmisor | undefined;
  private data_nomina_receptor: INodeNominaReceptor | undefined;
  private data_nomina_percepciones: INodeNominaPercepciones | undefined;
  private data_nomina_deducciones: INodeNominaDeducciones | undefined;
  constructor(readonly config_cfdi: ConfigCfdi) {
    super("N", config_cfdi);
  }
  public createNodeComprobante(data: INodeComprobante): void {
    const values: INC = {
      ...data,
      moneda: "MXN",
      exportacion: "01",
      metodoPago: "PUE",
    };
    this.setNodeComprobante(values);
  }
  public createNodeConcepto(data: INodeConcepto): void {
    const value = {
      concepto: {
        ...data.concepto,
        claveProdServ: "84111505",
        cantidad: 1,
        claveUnidad: "ACT",
        descripcion: "Pago de nómina",
        objetoImp: "01" as const,
      },
    };
    this.pushNodeConcepto(value);
  }
  public createNodeNomina(data: INodeNomina): void {
    this.data_nomina = data;
  }
  public createNodeNominaEmisor(data: INodeNominaEmisor): void {
    this.data_nomina_emisor = data;
  }
  public createNodeNominaReceptor(data: INodeNominaReceptor): void {
    this.data_nomina_receptor = data;
  }
  public createNodeNominaPercepciones(data: INodeNominaPercepciones): void {
    this.data_nomina_percepciones = data;
  }
  public createNodeNominaDeducciones(data: INodeNominaDeducciones): void {
    this.data_nomina_deducciones = data;
  }
}
export default FacturaNomina as unknown as { new (config_cfdi: ConfigCfdi): ICfdi & IFacturaNomina };
