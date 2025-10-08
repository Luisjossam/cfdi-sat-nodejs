import Cfdi from "../core/Cfdi";
import { ICfdi, INodeConcepto } from "../interfaces/ICfdi";
import { IFacturaEgreso, INodeComprobante } from "../interfaces/IFacturaEgreso";
import ConfigCfdi from "./ConfigCfdi";

class FacturaEgreso extends Cfdi implements IFacturaEgreso {
  constructor(readonly config_cfdi: ConfigCfdi) {
    super("E", config_cfdi);
  }
  public createNodeComprobante(data: INodeComprobante): void {
    this.setNodeComprobante(data);
  }
  public createNodeConcepto(data: INodeConcepto): void {
    this.pushNodeConcepto(data);
  }
}
export default FacturaEgreso as unknown as { new (config_cfdi: ConfigCfdi): ICfdi & IFacturaEgreso };
