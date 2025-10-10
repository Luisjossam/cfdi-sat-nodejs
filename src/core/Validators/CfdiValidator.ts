import CatalogoSat from "../../classes/CatalogoSat";
import Utils from "../../classes/Utils";
import comprobante_errors from "../../errors/ComprobanteErrors";
import { INodeComprobante } from "../../interfaces/ICfdi";
import { TComprobantes } from "../../types/TComprobantes";
import { TErrorOutput } from "../../types/TValidator";
import Cfdi from "../Cfdi";
import FacturaError from "../errors/FacturaError";
import Validator from "../Validator";

class CfdiValidator extends Validator {
  constructor() {
    super();
  }
  public async validateCfdi(cfdi: Cfdi): Promise<void> {
    this.handleValidation(await this.validateNodeComprobante(cfdi.getDataComprobante(), cfdi.getTypeCfdi()));
  }
  private handleValidation(result: TErrorOutput | undefined): void {
    if (result) {
      throw new FacturaError(result.message, result.code, result.codeSat);
    }
  }
  private async validateNodeComprobante(data: INodeComprobante | undefined, type_cfdi: TComprobantes): Promise<TErrorOutput | undefined> {
    return this.runValidations([
      () => this.existNode(data, "comprobante"),
      () => this.validateSerie(data?.serie),
      () => this.validateFolio(data?.folio),
      () => this.validateFecha(data?.fecha),
      () => this.validateMetodoPago(data?.metodoPago, type_cfdi),
      async () => await this.validateFormaPago(data?.formaPago, type_cfdi, data!.metodoPago!),
      () => this.validateSubtotal(data?.subtotal, type_cfdi),
      () => this.validateDescuento(data?.descuento, data!.subtotal, type_cfdi),
      () => this.validateTotal(data?.total, type_cfdi),
      async () => await this.validateMoneda(data?.moneda, type_cfdi),
      () => this.validateTipoCambio(data?.tipoCambio, data!.moneda!, type_cfdi),
      async () => await this.validateExportacion(data?.exportacion ?? "01"),
      () => this.validateCondicionesPago(data?.condicionesDePago, type_cfdi),
      async () => await this.validateLugarExpedicion(data?.lugarExpedicion),
    ]);
  }
  private existNode(data: any, name: string): TErrorOutput | undefined {
    if (data) return undefined;
    switch (name) {
      case "comprobante":
        return comprobante_errors.find((i) => i.code === "CSN400001");

      default:
        return comprobante_errors.find((i) => i.code === "CSN400000");
    }
  }
  private validateSerie(value: string | undefined): TErrorOutput | undefined {
    const result = this.validateValue(value, { min_length: 1, max_length: 25 });
    switch (result) {
      case "type":
        return comprobante_errors.find((i) => i.code === "CSN400020");
      case "empty":
        return comprobante_errors.find((i) => i.code === "CSN400021");
      case "min_length":
        return comprobante_errors.find((i) => i.code === "CSN400022");
      case "max_length":
        return comprobante_errors.find((i) => i.code === "CSN400023");
    }
    return undefined;
  }
  private validateFolio(value: string | undefined): TErrorOutput | undefined {
    const result = this.validateValue(value, { min_length: 1, max_length: 40 });
    switch (result) {
      case "type":
        return comprobante_errors.find((i) => i.code === "CSN400030");
      case "empty":
        return comprobante_errors.find((i) => i.code === "CSN400031");
      case "min_length":
        return comprobante_errors.find((i) => i.code === "CSN400032");
      case "max_length":
        return comprobante_errors.find((i) => i.code === "CSN400033");
    }
    return undefined;
  }
  private validateFecha(value: string | undefined): TErrorOutput | undefined {
    const result = this.validateValue(value, {
      regex_failed: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
      date_greater_than: new Date(Utils.dateCurrent()),
    });
    switch (result) {
      case "undefined":
        return comprobante_errors.find((i) => i.code === "CSN400010");
      case "type":
        return comprobante_errors.find((i) => i.code === "CSN400011");
      case "empty":
        return comprobante_errors.find((i) => i.code === "CSN400012");
      case "regex_failed":
        return comprobante_errors.find((i) => i.code === "CSN400013");
      case "date_greater_than":
        return comprobante_errors.find((i) => i.code === "CSN400014");
    }
    const date = new Date(value!);
    const today = new Date();
    if (date.getMonth() !== today.getMonth() || date.getFullYear() !== today.getFullYear()) {
      return comprobante_errors.find((i) => i.code === "CSN400015");
    }
    return undefined;
  }
  private validateMetodoPago(value: string | undefined, type_cfdi: TComprobantes): TErrorOutput | undefined {
    if (["P", "T"].includes(type_cfdi) && value !== undefined) return comprobante_errors.find((i) => i.code === "CSN400040");
    if (["I", "E", "N"].includes(type_cfdi)) {
      const result = this.validateValue(value, { not_includes_in: ["PPD", "PUE"] });
      switch (result) {
        case "undefined":
          return comprobante_errors.find((i) => i.code === "CSN400041");
        case "type":
          return comprobante_errors.find((i) => i.code === "CSN400042");
        case "empty":
          return comprobante_errors.find((i) => i.code === "CSN400043");
        case "not_includes_in":
          return comprobante_errors.find((i) => i.code === "CSN400044");
      }
    }
  }
  private async validateFormaPago(value: string | undefined, type_cfdi: TComprobantes, mp: "PUE" | "PPD"): Promise<TErrorOutput | undefined> {
    if (["P", "N", "T"].includes(type_cfdi) && value !== undefined) {
      return this.getError("comprobante_errors", "CSN400050");
    }
    if (["I", "E"].includes(type_cfdi)) {
      const result = this.validateValue(value, { not_includes_in: ["99"] });
      switch (result) {
        case "undefined":
          return this.getError("comprobante_errors", "CSN400051");
        case "type":
          return this.getError("comprobante_errors", "CSN400052");
        case "empty":
          return this.getError("comprobante_errors", "CSN400053");
        case "not_includes_in":
          if (mp === "PPD") return this.getError("comprobante_errors", "CSN400054");
          break;
      }
      try {
        await new CatalogoSat("formapago").search("clave", value!);
      } catch (error: any) {
        if (error.message === "Not found") return this.getError("comprobante_errors", "CSN400055");
      }
    }
  }
  private validateSubtotal(value: number | undefined, type_cfdi: TComprobantes): TErrorOutput | undefined {
    const result = this.validateValue(value, { is_number: true });
    switch (result) {
      case "undefined":
        return this.getError("comprobante_errors", "CSN400060");
      case "type":
      case "no_is_number":
        return this.getError("comprobante_errors", "CSN400061");
      case "empty":
        return this.getError("comprobante_errors", "CSN400062");
    }
    if (["T", "P"].includes(type_cfdi) && Number(value) !== 0) return this.getError("comprobante_errors", "CSN400063");
  }
  private validateDescuento(value: number | undefined, subtotal: number, type_cfdi: TComprobantes): TErrorOutput | undefined {
    const result = this.validateValue(value, {
      is_number: true,
      number_less_than: 0,
      number_greater_than: subtotal,
    });
    switch (result) {
      case "undefined":
        break;
      case "type":
      case "no_is_number":
        return this.getError("comprobante_errors", "CSN400070");
      case "empty":
        return this.getError("comprobante_errors", "CSN400071");
      case "number_less_than":
        return this.getError("comprobante_errors", "CSN400072");
      case "number_greater_than":
        return this.getError("comprobante_errors", "CSN400073");
    }
    if (["T", "P"].includes(type_cfdi) && value !== undefined) return this.getError("comprobante_errors", "CSN400074");
  }
  private validateTotal(value: number | undefined, type_cfdi: TComprobantes): TErrorOutput | undefined {
    const result = this.validateValue(value, { is_number: true, number_less_than: 0 });
    switch (result) {
      case "undefined":
        return this.getError("comprobante_errors", "CSN400080");
      case "type":
      case "no_is_number":
        return this.getError("comprobante_errors", "CSN400081");
      case "empty":
        return this.getError("comprobante_errors", "CSN400082");
      case "number_less_than":
        return this.getError("comprobante_errors", "CSN400083");
    }
    if (type_cfdi === "T" && Number(value) !== 0) return this.getError("comprobante_errors", "CSN400084");
  }
  private async validateMoneda(value: string | undefined, type: TComprobantes): Promise<TErrorOutput | undefined> {
    const result = this.validateValue(value);
    switch (result) {
      case "type":
        return this.getError("comprobante_errors", "CSN400090");

      case "empty":
        return this.getError("comprobante_errors", "CSN400091");
    }
    try {
      await new CatalogoSat("moneda").search("clave", value ?? "MXN");
    } catch (error: any) {
      if (error.message === "Not found") return this.getError("comprobante_errors", "CSN400092");
    }
  }
  private validateTipoCambio(value: number | undefined, currency: string, type_cfdi: TComprobantes): TErrorOutput | undefined {
    const result = this.validateValue(value, {
      is_number: true,
      number_less_than: 0,
      regex_failed: /^[0-9]{1,18}(\.[0-9]{1,6})?$/,
    });
    switch (result) {
      case "undefined":
        if (!["MXN", "XXX"].includes(currency)) return this.getError("comprobante_errors", "CSN400100");
        break;
      case "type":
      case "no_is_number":
        return this.getError("comprobante_errors", "CSN400101");
      case "empty":
        return this.getError("comprobante_errors", "CSN400102");
      case "regex_failed":
        return this.getError("comprobante_errors", "CSN400103");
    }
    if (currency === "MXN" && value !== undefined && Number(value) !== 1) return this.getError("comprobante_errors", "CSN400104");
  }
  private async validateExportacion(value: string | undefined): Promise<TErrorOutput | undefined> {
    const result = this.validateValue(value);
    switch (result) {
      case "type":
        return this.getError("comprobante_errors", "CSN400110");
      case "empty":
        return this.getError("comprobante_errors", "CSN400111");
    }
    try {
      await new CatalogoSat("exportacion").search("clave", value!);
    } catch (error: any) {
      if (error.message === "Not found") return this.getError("comprobante_errors", "CSN400112");
    }
  }
  private validateCondicionesPago(value: string | undefined, type_cfdi: TComprobantes): TErrorOutput | undefined {
    const res = this.validateValue(value, { max_length: 1000 });
    switch (res) {
      case "type":
        return this.getError("comprobante_errors", "CSN400120");
      case "empty":
        return this.getError("comprobante_errors", "CSN400121");
      case "max_length":
        return this.getError("comprobante_errors", "CSN400122");
    }
    if (["T", "N", "P"].includes(type_cfdi) && value !== undefined) return this.getError("comprobante_errors", "CSN400123");
  }
  private async validateLugarExpedicion(value: string | undefined): Promise<TErrorOutput | undefined> {
    const res = this.validateValue(value);
    switch (res) {
      case "undefined":
        return this.getError("comprobante_errors", "CSN400130");
      case "type":
        return this.getError("comprobante_errors", "CSN400131");
      case "empty":
        return this.getError("comprobante_errors", "CSN400132");
    }
    try {
      await new CatalogoSat("codigopostalparteuno").search("codigo_postal", value!);
    } catch {
      try {
        await new CatalogoSat("codigopostalpartedos").search("codigo_postal", value!);
      } catch (error: any) {
        if (error.message === "Not found") return this.getError("comprobante_errors", "CSN400133");
      }
    }
  }
  private getError(name_group: string, code: string): TErrorOutput | undefined {
    if (name_group === "comprobante_errors") {
      return comprobante_errors.find((i) => i.code === code);
    }
  }
}
export default CfdiValidator;
