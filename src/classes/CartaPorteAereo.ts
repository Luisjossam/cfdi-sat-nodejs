import CartaPorte from "../core/CartaPorte";
import { INodeAereo } from "../interfaces/ICartaPorte";
import ConfigCfdi from "./ConfigCfdi";

class CartaPorteAereo extends CartaPorte {
  constructor(cfdi: string | object, config_cfdi: ConfigCfdi) {
    super(cfdi, config_cfdi, "AV");
  }
  public createNodeAereo(data: INodeAereo) {
    this.setNodeTransporteAereo(data);
  }
}
export default CartaPorteAereo;
