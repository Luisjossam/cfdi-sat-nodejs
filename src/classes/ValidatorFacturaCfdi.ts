import { INodeComprobante, INodeInformacionGlobal, INodeRelacionados } from "../interfaces/IFacturaCfdi";
import Validator from "./Validator";
import {
  errors_anio,
  errors_descuento,
  errors_exportacion,
  errors_fecha,
  errors_folio,
  errors_forma_pago,
  errors_lugar_expedicion,
  errors_meses,
  errors_metodo_pago,
  errors_moneda,
  errors_periodicidad,
  errors_serie,
  errors_subtotal,
  errors_tipo_cambio,
  errors_tipo_comprobante,
  errors_tipo_relacion,
  errors_total,
  errors_uuids,
} from "../utils/errors_factura_cfdi";
import Utils from "./Utils";
import CatalogoSat from "./CatalogoSat";
interface IError {
  code: string;
  message: string;
}
interface IValidateValue {
  validator: () => string;
  errorsArray: { code: string; message: string }[];
}
type nodesTypes = "comprobante" | "informacion_global" | "relacionados";
class ValidatorFacturaCfdi extends Validator {
  private readonly type: nodesTypes | null = null;
  constructor(type: nodesTypes, private readonly data: any) {
    super();
    this.type = type;
  }
  async run() {
    switch (this.type) {
      case "comprobante":
        await this.validateNodeComprobante();
        break;
      case "informacion_global":
        await this.validateNodeInformacionGlobal();
        break;
      case "relacionados":
        await this.validateNodeRelacionados();
        break;
    }
  }
  private async validateNodeComprobante() {
    const data = this.data as unknown as INodeComprobante;
    if ("tipoDeComprobante" in data) {
      const err_tipo_comprobante_code = this.validateTipoComprobante(data.tipoDeComprobante);
      if (err_tipo_comprobante_code !== "") {
        return this.setErrors(errors_tipo_comprobante.find((i) => i.code === err_tipo_comprobante_code)!);
      }
    }
    let err_code = "";
    err_code = this.validateSerie(data.serie);
    if (err_code !== "") return this.setErrors(errors_serie.find((i) => i.code === err_code)!);

    err_code = this.validateFolio(data.folio);
    if (err_code !== "") return this.setErrors(errors_folio.find((i) => i.code === err_code)!);

    err_code = this.validateFecha(data.fecha);
    if (err_code !== "") return this.setErrors(errors_fecha.find((i) => i.code === err_code)!);

    err_code = this.validateMetodoPago(data.metodoPago, data.tipoDeComprobante ?? "I");
    if (err_code !== "") return this.setErrors(errors_metodo_pago.find((i) => i.code === err_code)!);

    err_code = await this.validateFormaPago(data.formaPago, data.tipoDeComprobante ?? "I", data.metodoPago);
    if (err_code !== "") return this.setErrors(errors_forma_pago.find((i) => i.code === err_code)!);

    err_code = this.validateSubtotal(data.subtotal, data.tipoDeComprobante ?? "I");
    if (err_code !== "") return this.setErrors(errors_subtotal.find((i) => i.code === err_code)!);

    err_code = this.validateDescuento(data.descuento, data.subtotal, data.tipoDeComprobante ?? "I");
    if (err_code !== "") return this.setErrors(errors_descuento.find((i) => i.code === err_code)!);

    err_code = await this.validateMoneda(data.moneda ?? "MXN");
    if (err_code !== "") return this.setErrors(errors_moneda.find((i) => i.code === err_code)!);

    err_code = this.validateTipoCambio(data.tipoCambio, data.moneda ?? "MXN");
    if (err_code !== "") return this.setErrors(errors_tipo_cambio.find((i) => i.code === err_code)!);

    err_code = this.validateTotal(data.total, data.tipoDeComprobante ?? "I");
    if (err_code !== "") return this.setErrors(errors_total.find((i) => i.code === err_code)!);

    err_code = await this.validateExportacion(data.exportacion ?? "01");
    if (err_code !== "") return this.setErrors(errors_exportacion.find((i) => i.code === err_code)!);

    err_code = await this.validateLugarExpedicion(data.lugarExpedicion);
    if (err_code !== "") return this.setErrors(errors_lugar_expedicion.find((i) => i.code === err_code)!);
  }
  private async validateNodeInformacionGlobal() {
    const data = this.data as unknown as INodeInformacionGlobal;
    const validations: IValidateValue[] = [
      { validator: () => this.validatePeriodicidad(data.periodicidad), errorsArray: errors_periodicidad },
      { validator: () => this.validateMeses(data.meses, data.periodicidad), errorsArray: errors_meses },
      { validator: () => this.validateAnio(data.anio), errorsArray: errors_anio },
    ];
    return this.runValidations(validations);
  }
  private async validateNodeRelacionados() {
    const data = this.data as unknown as INodeRelacionados;
    const validations: IValidateValue[] = [
      { validator: () => this.validateUuids(data.uuids), errorsArray: errors_uuids },
      { validator: () => this.validateTipoRelacion(data.tipoRelacion), errorsArray: errors_tipo_relacion },
    ];
    return this.runValidations(validations);
  }
  private runValidations(validations: { validator: () => string; errorsArray: IError[] }[]) {
    for (const { validator, errorsArray } of validations) {
      const err_code = validator();
      if (err_code !== "") {
        const error = errorsArray.find((i) => i.code === err_code);
        if (error) return this.setErrors(error);
      }
    }
  }
  private validateTipoComprobante(tipo_comprobante: string | undefined): string {
    const validateValueResult = this.validateValue(tipo_comprobante, { not_includes_in: ["I", "E", "P", "T"] });
    switch (validateValueResult.error_type) {
      case "type":
        return "CSN401001";
      case "not_includes_in":
        return "CSN401002";
    }
    return "";
  }
  private validateSerie(serie: string | undefined): string {
    const validateValueResult = this.validateValue(serie);
    switch (validateValueResult.error_type) {
      case "undefined":
        return "CSN402001";
      case "type":
        return "CSN402002";
      case "empty":
        return "CSN402003";
    }
    return "";
  }
  private validateFolio(folio: string | undefined): string {
    const validateValueResult = this.validateValue(folio);
    switch (validateValueResult.error_type) {
      case "undefined":
        return "CSN403001";
      case "type":
        return "CSN403002";
      case "empty":
        return "CSN403003";
    }
    return "";
  }
  private validateFecha(data: string | undefined): string {
    const validateValueResult = this.validateValue(data, {
      regex_failed: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
      date_greater_than: new Date(Utils.dateCurrent()),
    });
    let dateString = data;
    switch (validateValueResult.error_type) {
      case "undefined":
        return "CSN404001";
      case "type":
        return "CSN404003";
      case "empty":
        dateString = Utils.dateCurrent();
        break;
      case "regex_failed":
        return "CSN404002";
      case "date_greater_than":
        return "CSN404004";
    }
    const date = new Date(dateString!);
    const today = new Date();
    if (date.getMonth() !== today.getMonth() || date.getFullYear() !== today.getFullYear()) {
      return "CSN404005";
    }
    return "";
  }
  private validateMetodoPago(mp: string | undefined, tipo_comprobante: `I` | `E` | `P` | `T` | `N`): string {
    if (["I", "E", "N"].includes(tipo_comprobante)) {
      const validateValueResult = this.validateValue(mp, { not_includes_in: ["PPD", "PUE"] });
      switch (validateValueResult.error_type) {
        case "undefined":
          return "CSN406001";
        case "type":
          return "CSN406002";
        case "empty":
          return "CSN406003";
        case "not_includes_in":
          return "CSN406004";
      }
    }
    if (["P", "T"].includes(tipo_comprobante) && mp !== undefined) return "CSN406005";
    return "";
  }
  private async validateFormaPago(data: string | undefined, tipo_comprobante: `I` | `E` | `P` | `T` | `N`, mp: "PPD" | "PUE" | undefined): Promise<string> {
    if (["P", "N", "T"].includes(tipo_comprobante) && data !== undefined) {
      return "CSN405001";
    }
    if (["I", "E"].includes(tipo_comprobante)) {
      const validateValueResult = this.validateValue(data, { not_includes_in: ["99"] });
      switch (validateValueResult.error_type) {
        case "undefined":
          return "CSN405004";
        case "type":
          return "CSN405005";
        case "empty":
          return "CSN405006";
        case "not_includes_in":
          if (mp === "PPD") return "CSN405003";
          break;
      }
      try {
        await new CatalogoSat("formapago").search("clave", data!);
      } catch (error: any) {
        if (error.message === "Not found") return "CSN405002";
      }
    }

    return "";
  }
  private validateSubtotal(subtotal: string | number | undefined, tipo_comprobante: `I` | `E` | `P` | `T` | "N"): string {
    const validateValueResult = this.validateValue(subtotal, { is_number: true });
    switch (validateValueResult.error_type) {
      case "undefined":
        return "CSN407001";
      case "type":
        return "CSN407002";
      case "empty":
        return "CSN407003";
      case "no_is_number":
        return "CSN407005";
    }
    if (["T", "P"].includes(tipo_comprobante) && Number(subtotal) !== 0) return "CSN407004";
    return "";
  }
  private validateDescuento(descuento: string | number | undefined, subtotal: string | number, tipo_comprobante: `I` | `E` | `P` | `T` | "N"): string {
    const validateValueResult = this.validateValue(descuento, {
      is_number: true,
      number_less_than: 0,
      number_greater_than: Number(subtotal),
    });
    switch (validateValueResult.error_type) {
      case "undefined":
        break;
      case "type":
        return "CSN408001";
      case "empty":
        return "CSN408005";
      case "no_is_number":
      case "number_less_than":
        return "CSN408002";
      case "number_greater_than":
        return "CSN408004";
    }
    if (["T", "P"].includes(tipo_comprobante) && descuento !== undefined) return "CSN408003";
    return "";
  }
  private validateTipoCambio(tipo_cambio: string | number | undefined, moneda: string): string {
    const validateValueResult = this.validateValue(tipo_cambio, { is_number: true, number_less_than: 0, regex_failed: /^[0-9]{1,18}(\.[0-9]{1,6})?$/ });
    switch (validateValueResult.error_type) {
      case "undefined":
        if (!["MXN", "XXX"].includes(moneda)) return "CSN409002";
        break;
      case "type":
        return "CSN409001";
      case "empty":
        return "CSN409006";
      case "no_is_number":
      case "number_less_than":
        return "CSN409007";
      case "regex_failed":
        return "CSN409005";
    }
    if (moneda === "MXN" && tipo_cambio !== undefined && Number(tipo_cambio) !== 1) return "CSN409003";
    if (moneda === "XXX" && tipo_cambio !== undefined) return "CSN409004";
    return "";
  }
  private validateTotal(total: string | number | undefined, tipo_comprobante: string): string {
    const validateValueResult = this.validateValue(total, { is_number: true, number_less_than: 0 });
    switch (validateValueResult.error_type) {
      case "undefined":
        return "CSN401101";
      case "type":
        return "CSN401102";
      case "empty":
        return "CSN401103";
      case "no_is_number":
      case "number_less_than":
        return "CSN401105";
    }
    if (tipo_comprobante === "T") return "CSN401104";
    return "";
  }
  private async validateExportacion(exportacion: string): Promise<string> {
    const validateValueResult = this.validateValue(exportacion);
    switch (validateValueResult.error_type) {
      case "type":
        return "CSN401202";
      case "empty":
        return "CSN401203";
    }
    try {
      await new CatalogoSat("exportacion").search("clave", exportacion);
    } catch (error: any) {
      if (error.message === "Not found") return "CSN401201";
    }
    return "";
  }
  private async validateMoneda(moneda: string): Promise<string> {
    const validateValueResult = this.validateValue(moneda);
    switch (validateValueResult.error_type) {
      case "type":
        return "CSN401302";
      case "empty":
        return "CSN401303";
    }
    try {
      await new CatalogoSat("moneda").search("clave", moneda);
    } catch (error: any) {
      if (error.message === "Not found") return "CSN401301";
    }
    return "";
  }
  private async validateLugarExpedicion(lugar_expedicion: string | number | undefined): Promise<string> {
    const validateValueResult = this.validateValue(lugar_expedicion, { is_number: true, regex_failed: /^[0-9]{5}$/ });
    switch (validateValueResult.error_type) {
      case "undefined":
        return "CSN401402";
      case "type":
        return "CSN401403";
      case "empty":
        return "CSN401404";
      case "regex_failed":
        return "CSN401405";
    }
    try {
      await new CatalogoSat("codigopostalparteuno").search("codigo_postal", lugar_expedicion!.toString());
    } catch {
      try {
        await new CatalogoSat("codigopostalpartedos").search("codigo_postal", lugar_expedicion!.toString());
      } catch (error: any) {
        if (error.message === "Not found") return "CSN401401";
      }
    }
    return "";
  }
  private validatePeriodicidad(value: string): string {
    const validateValue = this.validateValue(value, { not_includes_in: ["01", "02", "03", "04", "05"] });
    switch (validateValue.error_type) {
      case "undefined":
        return "CSN401504";
      case "type":
        return "CSN401502";
      case "empty":
        return "CSN401503";
      case "not_includes_in":
        return "CSN401501";
    }
    return "";
  }
  private validateMeses(value: string, periodicidad: string): string {
    const options = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18"];
    const validateValue = this.validateValue(value, {
      not_includes_in: options,
      includes_in: options,
    });
    switch (validateValue.error_type) {
      case "undefined":
        return "CSN401604";
      case "type":
        return "CSN401602";
      case "empty":
        return "CSN401603";
      case "not_includes_in":
        return "CSN401601";
      case "includes_in":
        if (periodicidad === "05" && ![...options.slice(12)].includes(value)) return "CSN401605";
        if (periodicidad !== "05" && ![...options.slice(0, 12)].includes(value)) return "CSN401606";
        break;
    }
    return "";
  }
  private validateAnio(value: string | number): string {
    const validateValue = this.validateValue(value, {
      is_number: true,
      number_greater_than: new Date().getFullYear(),
      number_less_than: new Date().getFullYear() - 5,
    });
    switch (validateValue.error_type) {
      case "undefined":
        return "CSN401701";
      case "type":
        return "CSN401702";
      case "empty":
        return "CSN401703";
      case "number_greater_than":
        return "CSN401704";
      case "no_is_number":
        return "CSN401705";
      case "number_less_than":
        return "CSN401706";
    }
    return "";
  }
  private validateTipoRelacion(value: string): string {
    const validateValue = this.validateValue(value, {
      not_includes_in: ["01", "02", "03", "04", "05", "06", "07"],
    });
    switch (validateValue.error_type) {
      case "undefined":
        return "CSN401801";
      case "type":
        return "CSN401802";
      case "empty":
        return "CSN401803";
      case "not_includes_in":
        return "CSN401804";
    }
    return "";
  }
  private validateUuids(array: string[]): string {
    if (array === undefined || array.length === 0) return "CSN401901";
    if (!Array.isArray(array)) return "CSN401902";
    return "";
  }
}
export default ValidatorFacturaCfdi;
