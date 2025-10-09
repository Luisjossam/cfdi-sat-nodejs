import { INodeConc } from "./ICfdi";

export interface INodeComprobante {
  serie?: string;
  folio?: string;
  fecha: string;
  subtotal: number;
  total: number;
  lugarExpedicion: string;
  descuento?: number;
}
export interface INodeConcepto {
  concepto: Omit<INodeConc, "claveProdServ" | "noIdentificacion" | "cantidad" | "claveUnidad" | "unidad" | "descripcion" | "objetoImp">;
}
export interface INodeNomina {
  tipoNomina: string;
  fechaPago: string;
  fechaInicialPago: string;
  fechaFinalPago: string;
  numDiasPagados: number;
  totalPercepciones?: number;
  totalDeducciones?: number;
  totalOtrosPagos?: number;
}
export interface INodeNominaEmisor {
  curp?: string;
  registroPatronal?: string;
  rfcPatronOrigen?: string;
  entidadSncf?: INodeEntidadSncf;
}
export interface INodeEntidadSncf {
  origenRecurso: string;
  montoRecursoPropio?: number;
}
export interface INodeNominaReceptor {
  receptor: INodeNReceptor;
  subContratacion: INodeSubContratacion[];
}
export interface INodeNReceptor {
  curp: string;
  numSeguridadSocial?: string;
  fechaInicioRelLaboral?: string;
  antiguedad?: string;
  tipoContrato: string;
  sindicalizado?: string;
  tipoJornada?: string;
  tipoRegimen: string;
  numEmpleado: string;
  departamento?: string;
  puesto?: string;
  riesgoPuesto?: string;
  periodicidadPago: string;
  banco?: string;
  cuentaBancaria?: string;
  salarioBaseCotApor?: number;
  salarioDiarioIntegrado?: number;
  claveEntFed: string;
}
export interface INodeSubContratacion {
  rfcLabora: string;
  porcentajeTiempo: number;
}
export interface INodeNominaPercepciones {
  totales_percepcion: INodeNPercepciones;
  percepcion: INodePercepcion[];
  jubilacionPensionRetiro?: INodeJubilacionPensionRetiro;
  separacionIndemnizacion?: INodeSeparacionIndemnizacion;
}
export interface INodeNPercepciones {
  totalSueldos?: number;
  totalSeparacionIndemnizacion?: number;
  totalJubilacionPensionRetiro?: number;
  totalGravado: number;
  totalExento: number;
}
export interface INodePercepcion {
  tipoPercepcion: string;
  clave: string;
  concepto: string;
  importeGravado: number;
  importeExento: number;
  accionesOTitulos?: INodeAccionesOTitulos;
  horasExtras?: INodeHorasExtras[];
}
export interface INodeAccionesOTitulos {
  valorMercado: number;
  precioAlOtorgarse: number;
}
export interface INodeHorasExtras {
  dias: number;
  tipoHoras: string;
  horasExtras: number;
  importePagado: number;
}
export interface INodeJubilacionPensionRetiro {
  totalUnaExhibicion?: number;
  totalParcialidad?: number;
  montoDiario?: number;
  ingresoAcumulable: number;
  ingresoNoAcumulable: number;
}
export interface INodeSeparacionIndemnizacion {
  totalPagado: number;
  numAniosServicio: number;
  ultimoSueldoMensOrd: number;
  ingresoAcumulable: number;
  ingresoNoAcumulable: number;
}
export interface INodeNominaDeducciones {
  total_deduccion: INodeNDeducciones;
  deduccion: INodeDeduccion[];
}
export interface INodeNDeducciones {
  totalOtrasDeducciones?: number;
  totalImpuestosRetenidos?: number;
}
export interface INodeDeduccion {
  tipoDeduccion: string;
  clave: string;
  concepto: string;
  importe: number;
}
export interface INodeNominaOtroPago {
  otroPago: INodeNOtroPago;
  subsidioAlEmpleo?: INodeSubsidioAlEmpleo;
  compensacionSaldosAFavor?: INodeCompensacionSaldosAFavor;
}
export interface INodeNOtroPago {
  tipoOtroPago: string;
  clave: string;
  concepto: string;
  importe: number;
}
export interface INodeSubsidioAlEmpleo {
  subsidioCausado: number;
}
export interface INodeCompensacionSaldosAFavor {
  saldoAFavor: number;
  anio: number;
  remanenteSalFav: number;
}
export interface INodeNominaIncapacidades {
  diasIncapacidad: number;
  tipoIncapacidad: string;
  importeMonetario?: number;
}
export interface IFacturaNomina {
  createNodeComprobante(data: INodeComprobante): void;
  createNodeConcepto(data: INodeConcepto): void;
  createNodeNomina(data: INodeNomina): void;
  createNodeNominaEmisor(data: INodeNominaEmisor): void;
  createNodeNominaReceptor(data: INodeNominaReceptor): void;
  createNodeNominaPercepciones(data: INodeNominaPercepciones): void;
  createNodeNominaDeducciones(data: INodeNominaDeducciones): void;
  createNodeNominaOtroPago(data: INodeNominaOtroPago): void;
  createNodeNominaIncapacidades(data: INodeNominaIncapacidades): void;
}
export interface IDataNomina {
  nomina: INodeNomina | undefined;
  emisor: INodeNominaEmisor | undefined;
  receptor: INodeNominaReceptor | undefined;
  percepciones: INodeNominaPercepciones | undefined;
  deducciones: INodeNominaDeducciones | undefined;
  otrosPagos: INodeNominaOtroPago[];
  incapacidades: INodeNominaIncapacidades[];
}
