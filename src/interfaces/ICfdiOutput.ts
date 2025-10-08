export interface IComprobanteOutput {
  "xsi:schemaLocation": string;
  "xmlns:cfdi": string;
  "xmlns:xsi": string;
  Version: string;
  Serie?: string;
  Folio?: string;
  Fecha: string;
  SubTotal: string;
  Moneda: string;
  FormaPago?: string;
  Total: string;
  MetodoPago?: "PUE" | "PPD";
  TipoDeComprobante: "I" | "E" | "T" | "P" | "N";
  LugarExpedicion: string;
  NoCertificado: string;
  Certificado: string;
  Exportacion: string;
  CondicionesDePago?: string;
  Descuento?: string;
  TipoCambio?: number;
}
export interface IInformacionGlobalOutput {
  Periodicidad: "01" | "02" | "03" | "04" | "05";
  Meses: "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18";
  Año: number;
}
export interface INodeEmisorOutput {
  Rfc: string;
  Nombre: string;
  RegimenFiscal: string;
  FacAtrAdquirente?: string;
}
export interface INodeReceptorOutput {
  Rfc: string;
  Nombre: string;
  DomicilioFiscal: string;
  RegimenFiscal: string;
  UsoCFDI: string;
  ResidenciaFiscal?: string;
  NumRegIdTrib?: string;
}
export interface INodeConceptoOutput {
  ClaveProdServ: string;
  Cantidad: number;
  ClaveUnidad: string;
  Descripcion: string;
  ValorUnitario: string;
  Importe: string;
  ObjetoImp: "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08";
  Unidad?: string;
  NoIdentificacion?: string;
  Descuento?: string;
}
export interface INodeImpuestosOutput {
  Base: string;
  Impuesto: "001" | "002" | "003";
  TipoFactor: "Tasa" | "Cuota" | "Exento";
  TasaOCuota?: string;
  Importe?: string;
}
export interface INodeACuentaTercerosOutput {
  RfcACuentaTerceros: string;
  NombreACuentaTerceros: string;
  RegimenFiscalACuentaTerceros: string;
  DomicilioFiscalACuentaTerceros: string;
}
export interface INodeParteOutput extends Omit<INodeConceptoOutput, "ClaveUnidad" | "ObjetoImp" | "Descuento" | "ValorUnitario" | "Importe"> {
  ValorUnitario?: string;
  Importe?: string;
}
