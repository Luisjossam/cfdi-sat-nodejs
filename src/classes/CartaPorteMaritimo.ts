import { INodeContenedorM, INodeMaritimo } from "../interfaces/ICartaPorte";
import CartaPorte from "../core/CartaPorte";
import ConfigCfdi from "./ConfigCfdi";
class CartaPorteMaritimo extends CartaPorte {
  constructor(cfdi: string | object, config_cfdi: ConfigCfdi) {
    super(cfdi, config_cfdi, "M");
  }
  public createNodeMaritimo(data: INodeMaritimo) {
    this.setNodeTransporteMaritimo(data);
  }
  public createNodeContenedor(data: INodeContenedorM) {
    this.setNodeContenedorMaritimo(data);
  }
}
export default CartaPorteMaritimo;
