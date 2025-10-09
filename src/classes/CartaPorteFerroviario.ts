import { INodeCarro, INodeDerechosDePaso, INodeFerroviario } from "../interfaces/ICartaPorte";
import CartaPorte from "../core/CartaPorte";
import ConfigCfdi from "./ConfigCfdi";

class CartaPorteFerroviario extends CartaPorte {
  constructor(cfdi: string | object, config_cfdi: ConfigCfdi) {
    super(cfdi, config_cfdi, "F");
  }
  public createNodeFerroviario(data: INodeFerroviario) {
    this.setNodeTransporteFerroviario(data);
  }
  public createNodeDerechoDePaso(data: INodeDerechosDePaso) {
    this.setNodeDerechoDePasoFerr(data);
  }
  public createNodeCarro(data: INodeCarro) {
    this.setNodeCarroFerroviario(data);
  }
}

export default CartaPorteFerroviario;
