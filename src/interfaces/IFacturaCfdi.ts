export interface INodeComprobante {
  serie: string;
  folio: string;
  fecha: string;
  subtotal: string | number;
  formaPago?: string;
  total: string | number;
  metodoPago?: "PUE" | "PPD";
  lugarExpedicion: string | number;
  tipoDeComprobante?: "I" | "E" | "T" | "P";
  moneda?: string;
  exportacion?: string;
  condicionesDePago?: string;
  descuento?: string | number;
  tipoCambio?: string;
}
export interface IObjectNodeComprobante {
  "xsi:schemaLocation": string;
  "xmlns:cfdi": string;
  "xmlns:xsi": string;
  Version: string;
  Serie: string;
  Folio: string;
  Fecha: string;
  SubTotal: string | number;
  Moneda: string;
  FormaPago?: string | number;
  Total: string | number;
  MetodoPago?: "PUE" | "PPD";
  TipoDeComprobante: "I" | "E" | "T" | "P";
  LugarExpedicion: string | number;
  NoCertificado: string;
  Certificado: string;
  Exportacion: string;
  CondicionesDePago?: string;
  Descuento?: string | number;
  TipoCambio?: string;
}
export interface INodeInformacionGlobal {
  exist: boolean;
  periodicidad: "01" | "02" | "03" | "04" | "05";
  meses: "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18";
  anio: string | number;
}
export interface INodeRelacionados {
  tipoRelacion: "01" | "02" | "03" | "04" | "05" | "06" | "07";
  uuids: string[];
}
export interface INodeEmisor {
  rfc: string;
  nombre: string;
  regimenFiscal: string | number;
  facAtrAdquirente?: string;
}
export interface IObjectNodeEmisor {
  Rfc: string;
  Nombre: string;
  RegimenFiscal: string | number;
  FacAtrAdquirente?: string;
}
export interface INodeReceptor {
  rfc: string;
  nombre: string;
  domicilioFiscal: string | number;
  regimenFiscal: string | number;
  usoCfdi: string;
  residenciaFiscal?: string;
  numRegIdTrib?: string | number;
}
export interface IObjectNodeReceptor {
  Rfc: string;
  Nombre: string;
  DomicilioFiscalReceptor: string | number;
  RegimenFiscalReceptor: string | number;
  UsoCFDI: string;
  ResidenciaFiscal?: string;
  NumRegIdTrib?: string | number;
}
export interface INodeConcepto {
  concepto: INodeConc;
  impuestos?: INodeImp;
  aCuentaTerceros?: INodeACuentaTerceros;
  informacionAduanera?: INodeInformacionAduanera[];
  cuentaPredial?: {
    numero: string | number;
  }[];
  complementoConcepto?: INodeComplementoConcepto[];
  parte?: INodeParte[];
}
export interface INodeConc {
  claveProdServ: string | number;
  cantidad: string | number;
  claveUnidad: string;
  descripcion: string;
  valorUnitario: string | number;
  importe: string;
  unidad?: string;
  objetoImp?: "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08";
  noIdentificacion?: string;
  descuento?: string;
}
export interface IObjectNodeConcepto {
  ClaveProdServ: string | number;
  Cantidad: string | number;
  ClaveUnidad: string;
  Descripcion: string;
  ValorUnitario: string | number;
  Importe: string;
  ObjetoImp: "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08";
  Unidad?: string;
  NoIdentificacion?: string;
  Descuento?: string;
}
interface INodeImp {
  traslados?: INodeTraslado[];
  retenciones?: INodeRetencion[];
}
export interface INodeTraslado {
  base: string | number;
  impuesto: "001" | "002" | "003";
  tipoFactor: "Tasa" | "Cuota" | "Exento";
  tasaOCuota?: string | number;
  importe?: string | number;
}
export interface IObjectNodeTraslado {
  Base: string | number;
  Impuesto: "001" | "002" | "003";
  TipoFactor: "Tasa" | "Cuota" | "Exento";
  TasaOCuota?: string | number;
  Importe?: string | number;
}
export interface INodeRetencion extends INodeTraslado {}
export interface IObjectNodeRetencion extends IObjectNodeTraslado {}
export interface INodeACuentaTerceros {
  rfcACuentaTerceros: string;
  nombreACuentaTerceros: string;
  regimenFiscalACuentaTerceros: string | number;
  domicilioFiscalACuentaTerceros: string | number;
}
export interface IObjectNodeACuentaTerceros {
  RfcACuentaTerceros: string;
  NombreACuentaTerceros: string;
  RegimenFiscalACuentaTerceros: string | number;
  DomicilioFiscalACuentaTerceros: string | number;
}
interface INodeInformacionAduanera {
  numeroPedimento: string;
}
export interface INodeComplementoConcepto {
  node: string;
  attributes: Record<string, string>;
}
export interface INodeParte {
  concepto: INodeConcParte;
  informacionAduanera?: INodeInformacionAduanera[];
}
export interface INodeConcParte extends Omit<INodeConc, "claveUnidad" | "objetoImp" | "descuento" | "valorUnitario" | "importe" | "unidad"> {
  valorUnitario?: string;
  importe?: string;
  unidad?: string;
}
export interface IObjectNodeParte extends Omit<IObjectNodeConcepto, "ClaveUnidad" | "ObjetoImp" | "Descuento" | "ValorUnitario" | "Importe" | "Unidad"> {
  ValorUnitario?: string;
  Importe?: string;
  Unidad?: string;
}
export interface INodeAddenda {
  nodeBase: string;
  attributes: Record<string, string>;
  content?: string;
  nodes?: { nodeName: string; content?: string | number; nodes?: INodeObjectAddenda[] }[];
}
interface INodeObjectAddenda {
  nodeName: string;
  content: string | number;
}
