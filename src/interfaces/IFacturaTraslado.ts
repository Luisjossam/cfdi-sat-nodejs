import { INodeComplementoConcepto, INodeConc, INodeInformacionAduanera } from "./ICfdi";

export interface INodeComprobante {
  serie?: string;
  folio?: string;
  fecha: string;
  lugarExpedicion: string;
  exportacion?: string;
}
export interface INodeConcParte extends Omit<INodeConc, "claveUnidad" | "objetoImp" | "descuento"> {}
export interface INodeParte {
  concepto: INodeConcParte;
  informacionAduanera?: INodeInformacionAduanera[];
}
export interface INodeConcepto {
  concepto: Omit<INodeConc, "descuento" | "objetoImp">;
  informacionAduanera?: INodeInformacionAduanera[];
  cuentaPredial?: {
    numero: string;
  }[];
  complementoConcepto?: INodeComplementoConcepto[];
  parte?: INodeParte[];
}

export interface IFacturaTraslado {
  createNodeComprobante(data: INodeComprobante): void;
  createNodeConcepto(data: INodeConcepto): void;
}
