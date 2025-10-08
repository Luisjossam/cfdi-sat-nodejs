import { INodeConcepto } from "./ICfdi";

export interface INodeComprobante {
  serie?: string;
  folio?: string;
  fecha: string;
  subtotal: number;
  total: number;
  lugarExpedicion: string;
  moneda?: string;
  exportacion?: string;
  condicionesDePago?: string;
  descuento?: number;
  tipoCambio?: number;
}

export interface IFacturaEgreso {
  createNodeComprobante(data: INodeComprobante): void;
  createNodeConcepto(data: INodeConcepto): void;
}
