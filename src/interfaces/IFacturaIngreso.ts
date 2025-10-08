import { INodeConcepto, INodeInformacionGlobal } from "./ICfdi";
export interface INodeComprobante {
  serie?: string;
  folio?: string;
  fecha: string;
  subtotal: number;
  formaPago?: string;
  total: number;
  metodoPago?: "PUE" | "PPD";
  lugarExpedicion: string;
  moneda?: string;
  exportacion?: string;
  condicionesDePago?: string;
  descuento?: number;
  tipoCambio?: number;
}

export interface IFacturaIngreso {
  createNodeComprobante(data: INodeComprobante): void;
  createNodeInformacionGlobal(data: INodeInformacionGlobal): void;
  createNodeConcepto(data: INodeConcepto): void;
}
