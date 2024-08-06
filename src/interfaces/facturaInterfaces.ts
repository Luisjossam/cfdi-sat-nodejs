interface Attributes {
  [key: string]: string;
}
export interface ReceptorInterface {
  Rfc: string;
  Nombre: string;
  RegimenFiscal: string;
  DomicilioFiscalReceptor: string | number;
  RegimenFiscalReceptor: string | number;
  UsoCFDI: string;
}
export interface EmisorInterface {
  Rfc: string;
  Nombre: string;
  RegimenFiscal: string | number;
}
export interface atributosInterface {
  Folio: string | number;
  Fecha?: string;
  Serie?: string;
  TipoComprobante?: string;
  CondicionesDePago?: string;
  MetodoPago: string | number;
  FormaPago: string | number;
  LugarExpedicion: string | number;
  Subtotal: string | number;
  Total: string | number;
  Moneda?: string;
  Exportacion?: string | number;
  Descuento?: number;
}
export interface ImpuestoInterface {
  Impuesto: number | string;
  TipoFactor: string;
  TasaOCuota: number | string;
}
export interface RetencionesInterface {
  Impuesto: string;
  TasaOCuota: string | number;
  TipoFactor: string;
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
export interface InvoiceGlobalInterface {
  periocidad: string | number;
  meses: string | number;
  anio: string | number;
}
export interface PDFInterface {
  Xml: string;
  CadenaOriginal: string;
  Path?: string;
  Observaciones?: string;
  Logo?: string;
}
export interface cfdiJsonInterface {
  "@attributes"?: Attributes;
  "cfdi:Emisor"?: cfdiEmisorInterface;
  "cfdi:Receptor"?: cfdiReceptorInterface;
  "cfdi:Conceptos"?: cfdiConceptosInterface;
  "cfdi:Complemento"?: cfdiComplemento;
  "cfdi:Impuestos"?: cfdiImpuestos;
  "cfdi:CfdiRelacionados"?: cfdiRelacionados;
  "cfdi:InformacionGlobal"?: cfdiImpuestos;
}
export interface cfdiRelacionados {
  "@attributes": Attributes;
  "cfdi:CfdiRelacionado"?: cfdiImpuestos;
}
interface cfdiImpuestos {
  "@attributes": Attributes;
}
interface cfdiComplemento {
  "tfd:TimbreFiscalDigital"?: cfdiTimbreFDInterface;
}
interface cfdiTimbreFDInterface {
  "@attributes": Attributes;
}
interface cfdiEmisorInterface {
  "@attributes": Attributes;
}
interface cfdiReceptorInterface {
  "@attributes": Attributes;
}
export interface cfdiConceptosInterface {
  "@attributes"?: Attributes;
  [key: string]: any; // Para manejar otros posibles elementos
}
export interface usoCfdiInterface {
  clave: string;
  descripcion: string;
  fisica: string;
  moral: string;
  regimen_receptor: string;
}
export interface regimenFiscalInterface {
  clave: string;
  descripcion: string;
  fisica: string;
  moral: string;
}
export interface tipoRelacionInterface {
  clave: string;
  descripcion: string;
}
export interface catalogoResult {
  message?: string;
  status?: boolean;
  [key: string]: any; // Permite propiedades adicionales si es necesario
}
