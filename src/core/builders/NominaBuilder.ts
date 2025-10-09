import Utils from "../../classes/Utils";
import {
  IDataNomina,
  INodeAccionesOTitulos,
  INodeCompensacionSaldosAFavor,
  INodeDeduccion,
  INodeEntidadSncf,
  INodeHorasExtras,
  INodeJubilacionPensionRetiro,
  INodeNominaDeducciones,
  INodeNominaEmisor,
  INodeNominaIncapacidades,
  INodeNominaOtroPago,
  INodeNominaPercepciones,
  INodeNominaReceptor,
  INodePercepcion,
  INodeSeparacionIndemnizacion,
  INodeSubContratacion,
  INodeSubsidioAlEmpleo,
} from "../../interfaces/IFacturaNomina";
import {
  INodeNDeduccionOutput,
  INodeNominaCSAFOutput,
  INodeNominaDeduccionesOutput,
  INodeNominaEmisorEntidadSncfOutput,
  INodeNominaEmisorOutput,
  INodeNominaIncapacidadesOutput,
  INodeNominaOtrosPagosOutput,
  INodeNominaOutput,
  INodeNominaPercepcionesAOTOutput,
  INodeNominaPercepcionesHEOutput,
  INodeNominaPercepcionesJPROutput,
  INodeNominaPercepcionesOutput,
  INodeNominaPercepcionesPercepcionOutput,
  INodeNominaPercepcionesSIOutput,
  INodeNominaReceptorOutput,
  INodeNominaReceptorSubContratacionOutput,
  INodeNominaSAEOutput,
} from "../../interfaces/IFacturaNominaOutput";
import Parse from "../../utils/Parse";

class NominaBuilder {
  constructor(private readonly cfdi: Record<string, string>, private readonly data_nomina: IDataNomina) {}
  public createXml(): string {
    const cfdi = this.updatedCfdi();
    return Utils.jsonToXml(cfdi);
  }
  private updatedCfdi(): Record<string, string> {
    let json = this.cfdi as any;
    json["cfdi:Comprobante"][
      "@_xsi:schemaLocation"
    ] = `${json["cfdi:Comprobante"]["@_xsi:schemaLocation"]} http://www.sat.gob.mx/nomina12 http://www.sat.gob.mx/sitio_internet/cfd/nomina/nomina12.xsd`;
    json["cfdi:Comprobante"]["@_xmlns:nomina12"] = "http://www.sat.gob.mx/nomina12";
    const nodePagoAttrs = this.generateAttribute();
    if (!json["cfdi:Comprobante"]["cfdi:Complemento"]) {
      json["cfdi:Comprobante"]["cfdi:Complemento"] = {
        "nomina12:Nomina": nodePagoAttrs,
      };
    } else {
      Object.assign(json["cfdi:Comprobante"]["cfdi:Complemento"], {
        "nomina12:Nomina": nodePagoAttrs,
      });
    }
    return json;
  }
  private generateAttribute(): INodeNominaOutput {
    const att: INodeNominaOutput = {
      "@_Version": "1.2",
      "@_TipoNomina": this.data_nomina.nomina!.tipoNomina,
      "@_FechaPago": this.data_nomina.nomina!.fechaPago,
      "@_FechaInicialPago": this.data_nomina.nomina!.fechaInicialPago,
      "@_FechaFinalPago": this.data_nomina.nomina!.fechaFinalPago,
      "@_NumDiasPagados": this.data_nomina.nomina!.numDiasPagados.toString(),
      ...(this.data_nomina.nomina!.totalDeducciones && { "@_TotalDeducciones": Parse.parseNumber(this.data_nomina.nomina!.totalDeducciones, 2) }),
      ...(this.data_nomina.nomina!.totalOtrosPagos && { "@_TotalOtrosPagos": Parse.parseNumber(this.data_nomina.nomina!.totalOtrosPagos, 2) }),
      ...(this.data_nomina.nomina!.totalPercepciones && { "@_TotalPercepciones": Parse.parseNumber(this.data_nomina.nomina!.totalPercepciones, 2) }),
      ...(this.data_nomina.emisor && { "nomina12:Emisor": this.buildEmisor(this.data_nomina.emisor) }),
      "nomina12:Receptor": this.buildReceptor(this.data_nomina.receptor!),
      ...(this.data_nomina.percepciones && { "nomina12:Percepciones": this.buildPercepciones(this.data_nomina.percepciones) }),
      ...(this.data_nomina.deducciones && { "nomina12:Deducciones": this.buildDeducciones(this.data_nomina.deducciones) }),
      ...(this.data_nomina.otrosPagos.length > 0 && { "nomina12:OtrosPagos": this.buildOtrosPagos(this.data_nomina.otrosPagos) }),
      ...(this.data_nomina.incapacidades.length > 0 && { "nomina12:Incapacidades": this.buildIncapacidades(this.data_nomina.incapacidades) }),
    };
    return att;
  }
  private buildEmisor(data: INodeNominaEmisor): INodeNominaEmisorOutput {
    return {
      ...(data.curp && { "@_Curp": data.curp }),
      ...(data.registroPatronal && { "@_RegistroPatronal": data.registroPatronal }),
      ...(data.rfcPatronOrigen && { "@_RfcPatronOrigen": data.rfcPatronOrigen }),
      ...(data.entidadSncf && { "nomina12:EntidadSNCF": this.buildEmisorEntidadSncf(data.entidadSncf) }),
    };
  }
  private buildEmisorEntidadSncf(data: INodeEntidadSncf): INodeNominaEmisorEntidadSncfOutput {
    return {
      "@_OrigenRecurso": data.origenRecurso,
      ...(data.montoRecursoPropio && { "@_MontoRecursoPropio": data.montoRecursoPropio.toString() }),
    };
  }
  private buildReceptor(data: INodeNominaReceptor): INodeNominaReceptorOutput {
    return {
      "@_Curp": data.receptor.curp,
      "@_TipoRegimen": data.receptor.tipoRegimen,
      "@_ClaveEntFed": data.receptor.claveEntFed,
      "@_TipoContrato": data.receptor.tipoContrato,
      "@_NumEmpleado": data.receptor.numEmpleado,
      "@_PeriodicidadPago": data.receptor.periodicidadPago,
      ...(data.receptor.antiguedad && { "@_Antiguedad": data.receptor.antiguedad }),
      ...(data.receptor.banco && { "@_Banco": data.receptor.banco }),
      ...(data.receptor.cuentaBancaria && { "@_CuentaBancaria": data.receptor.cuentaBancaria }),
      ...(data.receptor.departamento && { "@_Departamento": data.receptor.departamento }),
      ...(data.receptor.fechaInicioRelLaboral && { "@_FechaInicioRelLaboral": data.receptor.fechaInicioRelLaboral }),
      ...(data.receptor.numSeguridadSocial && { "@_NumSeguridadSocial": data.receptor.numSeguridadSocial }),
      ...(data.receptor.puesto && { "@_Puesto": data.receptor.puesto }),
      ...(data.receptor.riesgoPuesto && { "@_RiesgoPuesto": data.receptor.riesgoPuesto }),
      ...(data.receptor.salarioBaseCotApor && { "@_SalarioBaseCotApor": Parse.parseNumber(data.receptor.salarioBaseCotApor, 2) }),
      ...(data.receptor.salarioDiarioIntegrado && { "@_SalarioDiarioIntegrado": Parse.parseNumber(data.receptor.salarioDiarioIntegrado, 2) }),
      ...(data.receptor.sindicalizado && { "@_Sindicalizado": data.receptor.sindicalizado }),
      ...(data.receptor.tipoJornada && { "@_TipoJornada": data.receptor.tipoJornada }),
      ...(data.subContratacion.length > 0 && { "nomina12:SubContratacion": this.buildSubContratacion(data.subContratacion) }),
    };
  }
  private buildSubContratacion(data: INodeSubContratacion[]): INodeNominaReceptorSubContratacionOutput[] {
    return data.map((i) => ({
      "@_RfcLabora": i.rfcLabora,
      "@_PorcentajeTiempo": i.porcentajeTiempo.toString(),
    }));
  }
  private buildPercepciones(data: INodeNominaPercepciones): INodeNominaPercepcionesOutput {
    return {
      "@_TotalExento": Parse.parseNumber(data.totales_percepcion.totalExento, 2),
      "@_TotalGravado": Parse.parseNumber(data.totales_percepcion.totalGravado, 2),
      ...(data.totales_percepcion.totalJubilacionPensionRetiro && {
        "@_TotalJubilacionPensionRetiro": Parse.parseNumber(data.totales_percepcion.totalJubilacionPensionRetiro, 2),
      }),
      ...(data.totales_percepcion.totalSeparacionIndemnizacion && {
        "@_TotalSeparacionIndemnizacion": Parse.parseNumber(data.totales_percepcion.totalSeparacionIndemnizacion, 2),
      }),
      ...(data.totales_percepcion.totalSueldos && {
        "@_TotalSueldos": Parse.parseNumber(data.totales_percepcion.totalSueldos, 2),
      }),
      "nomina12:Percepcion": this.buildPercepcion(data.percepcion),
      ...(data.jubilacionPensionRetiro && {
        "nomina12:JubilacionPensionRetiro": this.buildJPR(data.jubilacionPensionRetiro),
      }),
      ...(data.separacionIndemnizacion && {
        "nomina12:SeparacionIndemnizacion": this.buildSeparacionIndemnizacion(data.separacionIndemnizacion),
      }),
    };
  }
  private buildPercepcion(data: INodePercepcion[]): INodeNominaPercepcionesPercepcionOutput[] {
    return data.map((p) => ({
      "@_Clave": p.clave,
      "@_Concepto": p.concepto,
      "@_ImporteExento": Parse.parseNumber(p.importeExento, 2),
      "@_ImporteGravado": Parse.parseNumber(p.importeGravado, 2),
      "@_TipoPercepcion": p.tipoPercepcion,
      ...(p.accionesOTitulos && {
        "nomina12:AccionesOTitulos": this.buildAccionesOTitulos(p.accionesOTitulos),
      }),
      ...(p.horasExtras && {
        "nomina12:HorasExtras": this.buildHorasExtras(p.horasExtras),
      }),
    }));
  }
  private buildAccionesOTitulos(data: INodeAccionesOTitulos): INodeNominaPercepcionesAOTOutput {
    return {
      "@_PrecioAlOtorgarse": Parse.parseNumber(data.precioAlOtorgarse, 2),
      "@_ValorMercado": Parse.parseNumber(data.valorMercado, 2),
    };
  }
  private buildHorasExtras(data: INodeHorasExtras[]): INodeNominaPercepcionesHEOutput[] {
    return data.map((h) => ({
      "@_Dias": h.dias.toString(),
      "@_TipoHoras": h.tipoHoras,
      "@_HorasExtras": h.horasExtras.toString(),
      "@_ImportePagado": Parse.parseNumber(h.importePagado, 2),
    }));
  }
  private buildJPR(data: INodeJubilacionPensionRetiro): INodeNominaPercepcionesJPROutput {
    return {
      ...(data.totalUnaExhibicion && {
        "@_TotalUnaExhibicion": Parse.parseNumber(data.totalUnaExhibicion, 2),
      }),
      ...(data.totalParcialidad && {
        "@_TotalParcialidad": Parse.parseNumber(data.totalParcialidad, 2),
      }),
      ...(data.montoDiario && {
        "@_MontoDiario": Parse.parseNumber(data.montoDiario, 2),
      }),
      "@_IngresoAcumulable": Parse.parseNumber(data.ingresoAcumulable, 2),
      "@_IngresoNoAcumulable": Parse.parseNumber(data.ingresoNoAcumulable, 2),
    };
  }
  private buildSeparacionIndemnizacion(data: INodeSeparacionIndemnizacion): INodeNominaPercepcionesSIOutput {
    return {
      "@_TotalPagado": Parse.parseNumber(data.totalPagado, 2),
      "@_NumAñosServicio": data.numAniosServicio.toString(),
      "@_UltimoSueldoMensOrd": Parse.parseNumber(data.ultimoSueldoMensOrd, 2),
      "@_IngresoAcumulable": Parse.parseNumber(data.ingresoAcumulable, 2),
      "@_IngresoNoAcumulable": Parse.parseNumber(data.ingresoNoAcumulable, 2),
    };
  }
  private buildDeducciones(data: INodeNominaDeducciones): INodeNominaDeduccionesOutput {
    return {
      ...(data.total_deduccion.totalOtrasDeducciones && {
        "@_TotalOtrasDeducciones": Parse.parseNumber(data.total_deduccion.totalOtrasDeducciones, 2),
      }),
      ...(data.total_deduccion.totalImpuestosRetenidos && {
        "@_TotalImpuestosRetenidos": Parse.parseNumber(data.total_deduccion.totalImpuestosRetenidos, 2),
      }),
      "nomina12:Deduccion": this.buildDeduccion(data.deduccion),
    };
  }
  private buildDeduccion(data: INodeDeduccion[]): INodeNDeduccionOutput[] {
    return data.map((r) => ({
      "@_TipoDeduccion": r.tipoDeduccion,
      "@_Clave": r.clave,
      "@_Concepto": r.concepto,
      "@_Importe": Parse.parseNumber(r.importe, 2),
    }));
  }
  private buildOtrosPagos(data: INodeNominaOtroPago[]): INodeNominaOtrosPagosOutput {
    return {
      "nomina12:OtroPago": data.map((i) => ({
        "@_TipoOtroPago": i.otroPago.tipoOtroPago,
        "@_Clave": i.otroPago.clave,
        "@_Concepto": i.otroPago.concepto,
        "@_Importe": Parse.parseNumber(i.otroPago.importe, 2),
        ...(i.subsidioAlEmpleo && {
          "nomina12:SubsidioAlEmpleo": this.buildSAE(i.subsidioAlEmpleo),
        }),
        ...(i.compensacionSaldosAFavor && {
          "nomina12:CompensacionSaldosAFavor": this.buildCSAF(i.compensacionSaldosAFavor),
        }),
      })),
    };
  }
  private buildSAE(data: INodeSubsidioAlEmpleo): INodeNominaSAEOutput {
    return {
      "@_SubsidioCausado": Parse.parseNumber(data.subsidioCausado, 2),
    };
  }
  private buildCSAF(data: INodeCompensacionSaldosAFavor): INodeNominaCSAFOutput {
    return {
      "@_SaldoAFavor": Parse.parseNumber(data.saldoAFavor, 2),
      "@_Año": data.anio.toString(),
      "@_RemanenteSalFav": Parse.parseNumber(data.remanenteSalFav, 2),
    };
  }
  private buildIncapacidades(data: INodeNominaIncapacidades[]): INodeNominaIncapacidadesOutput {
    return {
      "nomina12:Incapacidad": data.map((i) => ({
        "@_DiasIncapacidad": i.diasIncapacidad.toString(),
        "@_TipoIncapacidad": i.tipoIncapacidad,
        ...(i.importeMonetario && {
          "@_ImporteMonetario": Parse.parseNumber(i.importeMonetario, 2),
        }),
      })),
    };
  }
}
export default NominaBuilder;
