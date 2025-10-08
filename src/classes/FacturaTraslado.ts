import Cfdi from "../core/Cfdi";
import { ICfdi, INodeConc, INodeInformacionAduanera } from "../interfaces/ICfdi";
import { IFacturaTraslado, INodeComprobante, INodeConcepto, INodeParte } from "../interfaces/IFacturaTraslado";
import ConfigCfdi from "./ConfigCfdi";

class FacturaTraslado extends Cfdi implements IFacturaTraslado {
  constructor(readonly config_cfdi: ConfigCfdi) {
    super("T", config_cfdi);
  }
  public createNodeComprobante(data: INodeComprobante): void {
    const values = {
      ...data,
      moneda: "XXX",
      total: 0,
      subtotal: 0,
    };
    this.setNodeComprobante(values);
  }
  public createNodeConcepto(data: INodeConcepto): void {
    const values: INodeConcepto & { concepto: { objetoImp: "01" } } = {
      ...data,
      concepto: {
        ...data.concepto,
        objetoImp: "01",
      },
    };

    this.pushNodeConcepto(values);
  }
}
export default FacturaTraslado as unknown as { new (config_cfdi: ConfigCfdi): ICfdi & IFacturaTraslado };
