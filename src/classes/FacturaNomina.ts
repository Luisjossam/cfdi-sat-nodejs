import NominaBuilder from "../core/builders/NominaBuilder";
import Cfdi from "../core/Cfdi";
import { ICfdi, INodeComprobante as INC } from "../interfaces/ICfdi";
import {
  IDataNomina,
  IFacturaNomina,
  INodeComprobante,
  INodeConcepto,
  INodeNomina,
  INodeNominaDeducciones,
  INodeNominaEmisor,
  INodeNominaIncapacidades,
  INodeNominaOtroPago,
  INodeNominaPercepciones,
  INodeNominaReceptor,
} from "../interfaces/IFacturaNomina";
import ConfigCfdi from "./ConfigCfdi";

class FacturaNomina extends Cfdi implements IFacturaNomina {
  private readonly data_nomina: IDataNomina = {
    nomina: undefined,
    deducciones: undefined,
    emisor: undefined,
    incapacidades: [],
    otrosPagos: [],
    percepciones: undefined,
    receptor: undefined,
  };
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
    this.data_nomina.nomina = data;
  }
  public createNodeNominaEmisor(data: INodeNominaEmisor): void {
    this.data_nomina.emisor = data;
  }
  public createNodeNominaReceptor(data: INodeNominaReceptor): void {
    this.data_nomina.receptor = data;
  }
  public createNodeNominaPercepciones(data: INodeNominaPercepciones): void {
    this.data_nomina.percepciones = data;
  }
  public createNodeNominaDeducciones(data: INodeNominaDeducciones): void {
    this.data_nomina.deducciones = data;
  }
  public createNodeNominaOtroPago(data: INodeNominaOtroPago): void {
    this.data_nomina.otrosPagos.push(data);
  }
  public createNodeNominaIncapacidades(data: INodeNominaIncapacidades): void {
    this.data_nomina.incapacidades.push(data);
  }
  override async createXml(): Promise<string> {
    const xml = await super.createJson();
    return new NominaBuilder(xml, this.data_nomina).createXml();
  }
}
export default FacturaNomina as unknown as { new (config_cfdi: ConfigCfdi): ICfdi & IFacturaNomina };
