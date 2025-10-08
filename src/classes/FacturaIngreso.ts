import Cfdi from "../core/Cfdi";
import { ICfdi, INodeConcepto, INodeInformacionGlobal } from "../interfaces/ICfdi";
import { IFacturaIngreso, INodeComprobante } from "../interfaces/IFacturaIngreso";
import ConfigCfdi from "./ConfigCfdi";

class FacturaIngreso extends Cfdi implements IFacturaIngreso {
  constructor(readonly config_cfdi: ConfigCfdi) {
    super("I", config_cfdi);
  }
  public createNodeComprobante(data: INodeComprobante): void {
    this.setNodeComprobante(data);
  }
  public createNodeInformacionGlobal(data: INodeInformacionGlobal): void {
    this.setNodeInformacionGlobal(data);
  }
  public createNodeConcepto(data: INodeConcepto): void {
    this.pushNodeConcepto(data);
  }
}
export default FacturaIngreso as unknown as { new (config_cfdi: ConfigCfdi): ICfdi & IFacturaIngreso };
