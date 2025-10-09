export interface INodeNominaOutput {
  "@_Version": string;
  "@_TipoNomina": string;
  "@_FechaPago": string;
  "@_FechaInicialPago": string;
  "@_FechaFinalPago": string;
  "@_NumDiasPagados": string;
  "@_TotalPercepciones"?: string;
  "@_TotalDeducciones"?: string;
  "@_TotalOtrosPagos"?: string;
  "nomina12:Emisor"?: INodeNominaEmisorOutput;
  "nomina12:Receptor": INodeNominaReceptorOutput;
  "nomina12:Percepciones"?: INodeNominaPercepcionesOutput;
  "nomina12:Deducciones"?: INodeNominaDeduccionesOutput;
  "nomina12:OtrosPagos"?: INodeNominaOtrosPagosOutput;
  "nomina12:Incapacidades"?: INodeNominaIncapacidadesOutput;
}
export interface INodeNominaEmisorOutput {
  "@_Curp"?: string;
  "@_RegistroPatronal"?: string;
  "@_RfcPatronOrigen"?: string;
  "nomina12:EntidadSNCF"?: INodeNominaEmisorEntidadSncfOutput;
}
export interface INodeNominaEmisorEntidadSncfOutput {
  "@_OrigenRecurso": string;
  "@_MontoRecursoPropio"?: string;
}
export interface INodeNominaReceptorOutput {
  "@_Curp": string;
  "@_NumSeguridadSocial"?: string;
  "@_FechaInicioRelLaboral"?: string;
  "@_Antiguedad"?: string;
  "@_TipoContrato": string;
  "@_Sindicalizado"?: string;
  "@_TipoJornada"?: string;
  "@_TipoRegimen": string;
  "@_NumEmpleado": string;
  "@_Departamento"?: string;
  "@_Puesto"?: string;
  "@_RiesgoPuesto"?: string;
  "@_PeriodicidadPago": string;
  "@_Banco"?: string;
  "@_CuentaBancaria"?: string;
  "@_SalarioBaseCotApor"?: string;
  "@_SalarioDiarioIntegrado"?: string;
  "@_ClaveEntFed": string;
  "nomina12:SubContratacion"?: INodeNominaReceptorSubContratacionOutput[];
}
export interface INodeNominaReceptorSubContratacionOutput {
  "@_RfcLabora": string;
  "@_PorcentajeTiempo": string;
}
export interface INodeNominaPercepcionesOutput {
  "@_TotalSueldos"?: string;
  "@_TotalSeparacionIndemnizacion"?: string;
  "@_TotalJubilacionPensionRetiro"?: string;
  "@_TotalGravado": string;
  "@_TotalExento": string;
  "nomina12:Percepcion": INodeNominaPercepcionesPercepcionOutput[];
  "nomina12:JubilacionPensionRetiro"?: INodeNominaPercepcionesJPROutput;
  "nomina12:SeparacionIndemnizacion"?: INodeNominaPercepcionesSIOutput;
}
export interface INodeNominaPercepcionesPercepcionOutput {
  "@_TipoPercepcion": string;
  "@_Clave": string;
  "@_Concepto": string;
  "@_ImporteGravado": string;
  "@_ImporteExento": string;
  "nomina12:AccionesOTitulos"?: INodeNominaPercepcionesAOTOutput;
  "nomina12:HorasExtras"?: INodeNominaPercepcionesHEOutput[];
}
export interface INodeNominaPercepcionesAOTOutput {
  "@_ValorMercado": string;
  "@_PrecioAlOtorgarse": string;
}
export interface INodeNominaPercepcionesHEOutput {
  "@_Dias": string;
  "@_TipoHoras": string;
  "@_HorasExtras": string;
  "@_ImportePagado": string;
}
export interface INodeNominaPercepcionesJPROutput {
  "@_TotalUnaExhibicion"?: string;
  "@_TotalParcialidad"?: string;
  "@_MontoDiario"?: string;
  "@_IngresoAcumulable": string;
  "@_IngresoNoAcumulable": string;
}
export interface INodeNominaPercepcionesSIOutput {
  "@_TotalPagado": string;
  "@_NumAñosServicio": string;
  "@_UltimoSueldoMensOrd": string;
  "@_IngresoAcumulable": string;
  "@_IngresoNoAcumulable": string;
}
export interface INodeNominaDeduccionesOutput {
  "@_TotalOtrasDeducciones"?: string;
  "@_TotalImpuestosRetenidos"?: string;
  "nomina12:Deduccion": INodeNDeduccionOutput[];
}
export interface INodeNDeduccionOutput {
  "@_TipoDeduccion": string;
  "@_Clave": string;
  "@_Concepto": string;
  "@_Importe": string;
}
export interface INodeNominaOtrosPagosOutput {
  "nomina12:OtroPago": INodeNominaOtroPagoOutput[];
}
export interface INodeNominaOtroPagoOutput {
  "@_TipoOtroPago": string;
  "@_Clave": string;
  "@_Concepto": string;
  "@_Importe": string;
  "nomina12:SubsidioAlEmpleo"?: INodeNominaSAEOutput;
  "nomina12:CompensacionSaldosAFavor"?: INodeNominaCSAFOutput;
}
export interface INodeNominaSAEOutput {
  "@_SubsidioCausado": string;
}
export interface INodeNominaCSAFOutput {
  "@_SaldoAFavor": string;
  "@_Año": string;
  "@_RemanenteSalFav": string;
}
export interface INodeNominaIncapacidadesOutput {
  "nomina12:Incapacidad": INodeNominaIncapacidadOutput[];
}
export interface INodeNominaIncapacidadOutput {
  "@_DiasIncapacidad": string;
  "@_TipoIncapacidad": string;
  "@_ImporteMonetario"?: string;
}
