export interface facturaInterface {
  emisorXml: string;
  receptorXml: string;
  noCertificado: string;
  certificado: string;
  emisor: object;
}
export interface ReceptorInterface {
  Rfc: string;
  Nombre: string;
  RegimenFiscal: string;
  DomicilioFiscalReceptor: number | string;
  RegimenFiscalReceptor: number | string;
  UsoCFDI: string;
}
export interface EmisorInterface {
  Rfc: string;
  Nombre: string;
  RegimenFiscal: string;
}
export interface atributosInterface {
  folio: string;
  fecha?: string;
  serie?: string;
  tipoComprobante?: string;
  condicionesDePago?: string;
  metodoPago: string;
  formaPago: number;
  lugarExpedicion: number;
  subtotal: number;
  total: number;
  moneda?: string;
  exportacion?: number;
}
export interface ImpuestoInterface {
  Impuesto: number | string;
  TipoFactor: string;
  TasaOCuota: number;
}
export interface RetencionesInterface {
  Impuesto: string;
  TasaOCuota: string | number;
}
export interface atributosConceptoInterface {
  ClaveProdServ: number | string;
  Cantidad: number | string;
  ClaveUnidad: number | string;
  Unidad: string;
  Descripcion: string;
  ValorUnitario: number | string;
  Importe: number | string;
  ObjetoImp: number | string;
  Descuento?: number | null;
  Impuesto: ImpuestoInterface;
  NoIdentificacion: string | null;
  Retenciones?: RetencionesInterface[];
}
