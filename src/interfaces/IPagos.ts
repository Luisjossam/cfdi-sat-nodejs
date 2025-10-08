export interface IObjectNodePagos {
  "@_Version": string;
  "pago20:Totales": IObjectNodeTotales;
  "pago20:Pago": IObjectNodePago[];
}
export interface INodeTotales {
  montoTotalPagos: number;
  totalRetencionesIva?: number;
  totalRetencionesIsr?: number;
  totalRetencionesIeps?: number;
  totalTrasladosBaseIva16?: number;
  totalTrasladosImpuestoIva16?: number;
  totalTrasladosBaseIva8?: number;
  totalTrasladosImpuestoIva8?: number;
  totalTrasladosBaseIva0?: number;
  totalTrasladosImpuestoIva0?: number;
  totalTrasladosBaseIvaExento?: number;
}
export interface IObjectNodeTotales {
  "@_MontoTotalPagos": string | number;
  "@_TotalRetencionesIVA"?: string | number;
  "@_TotalRetencionesISR"?: string | number;
  "@_TotalRetencionesIEPS"?: string | number;
  "@_TotalTrasladosBaseIVA16"?: string | number;
  "@_TotalTrasladosImpuestoIVA16"?: string | number;
  "@_TotalTrasladosBaseIVA8"?: string | number;
  "@_TotalTrasladosImpuestoIVA8"?: string | number;
  "@_TotalTrasladosBaseIVA0"?: string | number;
  "@_TotalTrasladosImpuestoIVA0"?: string | number;
  "@_TotalTrasladosBaseIVAExento"?: string | number;
}
export interface INodePago {
  pago: IPago;
  doctoRelacionados: IDocRelacionado[];
}
export interface IPago {
  fechaPago: string;
  formaDePagoP: string;
  monedaP: string;
  monto: number;
  tipoCambioP?: number;
  numOperacion?: string;
  rfcEmisorCtaOrd?: string;
  nomBancoOrdExt?: string;
  ctaOrdenante?: string;
  rfcEmisorCtaBen?: string;
  ctaBeneficiario?: string;
  tipoCadPago?: string;
  certPago?: string;
  cadPago?: string;
  selloPago?: string;
}
export interface IObjectNodePago {
  "@_FechaPago": string;
  "@_FormaDePagoP": string;
  "@_MonedaP": string;
  "@_Monto": string | number;
  "@_TipoCambioP"?: string | number;
  "@_NumOperacion"?: string;
  "@_RFCEmisorCtaOrd"?: string;
  "@_NomBancoOrdExt"?: string;
  "@_CtaOrdenante"?: string;
  "@_RFCEmisorCtaBen"?: string;
  "@_CtaBeneficiario"?: string;
  "@_TipoCadPago"?: string;
  "@_CertPago"?: string;
  "@_CadPago"?: string;
  "@_SelloPago"?: string;
  "pago20:DoctoRelacionado": IObjectNodeDocRela[];
  "pago20:ImpuestosP": IObjectNodePImp;
}
export interface IObjectNodePImp {
  "pago20:RetencionesP"?: { "pago20:RetencionP": IObjectPRetenciones[] };
  "pago20:TrasladosP"?: { "pago20:TrasladoP": IObjectPTraslado[] };
}
export interface IDocRelacionado {
  doctoRelacionado: IDocRela;
  impuestos: { retenciones?: IDocRelRetenciones[]; traslados?: IDocRelTraslado[] };
}
export interface IDocRela {
  idDocumento: string;
  monedaDr: string;
  numParcialidad: string | number;
  impSaldoAnt: string | number;
  impPagado: string | number;
  impSaldoInsoluto: string | number;
  objetoImpDr: string;
  serie?: string;
  folio?: string;
  equivalenciaDr?: string | number;
}
export interface IObjectNodeDocRela {
  "@_IdDocumento": string;
  "@_MonedaDR": string;
  "@_NumParcialidad": string | number;
  "@_ImpSaldoAnt": string | number;
  "@_ImpPagado": string | number;
  "@_ImpSaldoInsoluto": string | number;
  "@_ObjetoImpDR": string;
  "@_Serie"?: string;
  "@_Folio"?: string;
  "@_EquivalenciaDR"?: string | number;
  "pago20:ImpuestosDR": IObjectNodeImp;
}
export interface IObjectNodeImp {
  "pago20:RetencionesDR"?: { "pago20:RetencionDR": IObjectDocRelRetenciones[] };
  "pago20:TrasladosDR"?: { "pago20:TrasladoDR": IObjectDocRelTraslado[] };
}
export interface IDocRelRetenciones {
  baseDr: string | number;
  impuestoDr: string;
  tipoFactorDr: string;
  tasaOCuotaDr: string | number;
  importeDr: string | number;
}
export interface IObjectDocRelRetenciones {
  "@_BaseDR": string | number;
  "@_ImpuestoDR": string;
  "@_TipoFactorDR": string;
  "@_TasaOCuotaDR": string | number;
  "@_ImporteDR": string | number;
}
export interface IDocRelTraslado extends Omit<IDocRelRetenciones, "tasaOCuotaDr" | "importeDr"> {
  tasaOCuotaDr?: string | number;
  importeDr?: string | number;
}
export interface IObjectDocRelTraslado extends Omit<IObjectDocRelRetenciones, "@_TasaOCuotaDR" | "@_ImporteDR"> {
  "@_TasaOCuotaDR"?: string | number;
  "@_ImporteDR"?: string | number;
}
export interface IPRetenciones {
  impuestoP: string;
  importeP: string;
}
export interface IObjectPRetenciones {
  "@_ImpuestoP": string;
  "@_ImporteP": string;
}
export interface IPTraslado {
  baseP: string;
  impuestoP: string;
  tipoFactorP: string;
  tasaOCuotaP?: string | number;
  importeP?: string;
}
export interface IObjectPTraslado {
  "@_BaseP": string;
  "@_ImpuestoP": string;
  "@_TipoFactorP": string;
  "@_TasaOCuotaP"?: string | number;
  "@_ImporteP"?: string;
}
