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
export interface INodeRelacionados {
  tipoRelacion: "01" | "02" | "03" | "04" | "05" | "06" | "07";
  uuids: string[];
}
export interface INodeInformacionGlobal {
  periodicidad: "01" | "02" | "03" | "04" | "05";
  meses: "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18";
  anio: number;
}
export interface INodeEmisor {
  rfc: string;
  nombre: string;
  regimenFiscal: string;
  facAtrAdquirente?: string;
}
export interface INodeReceptor {
  rfc: string;
  nombre: string;
  domicilioFiscal: string;
  regimenFiscal: string;
  usoCfdi: string;
  residenciaFiscal?: string;
  numRegIdTrib?: string;
}
export interface INodeConcepto {
  concepto: INodeConc;
  impuestos?: INodeImp;
  aCuentaTerceros?: INodeACuentaTerceros;
  informacionAduanera?: INodeInformacionAduanera[];
  cuentaPredial?: {
    numero: string;
  }[];
  complementoConcepto?: INodeComplementoConcepto[];
  parte?: INodeParte[];
}
export interface INodeConc {
  claveProdServ: string;
  cantidad: number;
  claveUnidad: string;
  descripcion: string;
  valorUnitario: number;
  importe: number;
  unidad?: string;
  objetoImp?: "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08";
  noIdentificacion?: string;
  descuento?: number;
}
interface INodeImp {
  traslados?: INodeImpuestos[];
  retenciones?: INodeImpuestos[];
}
export interface INodeImpuestos {
  base: number;
  impuesto: "001" | "002" | "003";
  tipoFactor: "Tasa" | "Cuota" | "Exento";
  tasaOCuota?: number;
  importe?: number;
}
export interface INodeACuentaTerceros {
  rfcACuentaTerceros: string;
  nombreACuentaTerceros: string;
  regimenFiscalACuentaTerceros: string;
  domicilioFiscalACuentaTerceros: string;
}
export interface INodeInformacionAduanera {
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
export interface INodeConcParte extends Omit<INodeConc, "claveUnidad" | "objetoImp" | "descuento" | "valorUnitario" | "importe"> {
  valorUnitario?: number;
  importe?: number;
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
export interface ICfdi {
  createNodeRelacionados(data: INodeRelacionados): void;
  createNodeEmisor(data: INodeEmisor): void;
  createNodeReceptor(data: INodeReceptor): void;
  createNodeAddenda(data: INodeAddenda): void;
  createXml(): Promise<string>;
  createXmlSellado(): Promise<string>;
  createJson(simplified?: boolean): Promise<Record<string, string | number>>;
  createJsonSellado(simplified?: boolean): Promise<Record<string, string | number>>;
}
