import { INodePago, INodeTotales } from "./IPagos";

export interface INodeComprobante {
  serie?: string;
  folio?: string;
  fecha: string;
  lugarExpedicion: string;
}
export interface IFacturaPago {
  createNodeComprobante(data: INodeComprobante): void;
  createNodeTotales(data: INodeTotales): void;
  createNodePago(data: INodePago): void;
}
