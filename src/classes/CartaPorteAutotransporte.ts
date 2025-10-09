import { INodeTransporte, INodeIdenVehicular, INodeRemolques, INodeSeguros } from "../interfaces/ICartaPorte";
import CartaPorte from "../core/CartaPorte";
import ConfigCfdi from "./ConfigCfdi";

class CartaPorteAutotransporte extends CartaPorte {
  constructor(cfdi: string | object, config_cfdi: ConfigCfdi) {
    super(cfdi, config_cfdi, "A");
  }
  public createNodeAutotransporte(data: INodeTransporte) {
    this.setNodeTransporteData(data);
  }
  public createNodeIdentificacionVehicular(data: INodeIdenVehicular) {
    this.setNodeAutotransporteIdenVehicular(data);
  }
  public createNodeSeguros(data: INodeSeguros) {
    this.setNodeAutotransporteSeguros(data);
  }
  public createNodeRemolques(data: INodeRemolques) {
    this.setNodeAutotransporteRemolques(data);
  }
}
export default CartaPorteAutotransporte;
