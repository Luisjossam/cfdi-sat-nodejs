import CatalogoSat from "../../classes/CatalogoSat";
import Utils from "../../classes/Utils";
import comprobante_errors from "../../errors/ComprobanteErrors";
import emisor_errors from "../../errors/EmisorErrors";
import infGlobal_errors from "../../errors/InformacionGlobalErrors";
import receptor_errors from "../../errors/ReceptorErrors";
import { INodeComprobante, INodeEmisor, INodeInformacionGlobal, INodeReceptor } from "../../interfaces/ICfdi";
import { TComprobantes } from "../../types/TComprobantes";
import { TErrorOutput } from "../../types/TValidator";
import Cfdi from "../Cfdi";
import FacturaError from "../errors/FacturaError";
import Validator from "../Validator";

type TEmiRec = "receptor" | "emisor";
class CfdiValidator extends Validator {
  constructor() {
    super();
  }
  public async validateCfdi(cfdi: Cfdi): Promise<void> {
    const type_cfdi = cfdi.getTypeCfdi();
    const comprobante = cfdi.getDataComprobante();
    const receptor = cfdi.getDataReceptor();
    this.handleValidation(await this.validateNodeComprobante(comprobante, type_cfdi));
    this.handleValidation(await this.validateNodeEmisor(cfdi.getDataEmisor(), type_cfdi));
    this.handleValidation(await this.validateNodeReceptor(receptor, type_cfdi, comprobante!.lugarExpedicion));
    this.handleValidation(await this.validateNodeInformacionGlobal(cfdi.getDataInformacionGlobal(), receptor!.rfc, receptor!.nombre, receptor!.regimenFiscal));
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
  private async validateNodeEmisor(data: INodeEmisor | undefined, type_cfdi: TComprobantes): Promise<TErrorOutput | undefined> {
    return this.runValidations([
      () => this.existNode(data, "emisor"),
      () => this.validateRfc(data?.rfc, "emisor"),
      () => this.validateName(data?.nombre, "emisor"),
      async () => await this.validateRegFiscal(data?.regimenFiscal, "emisor", data!.rfc),
      () => this.validateFacAtrAdquirente(data?.facAtrAdquirente),
    ]);
  }
  private async validateNodeReceptor(data: INodeReceptor | undefined, type_cfdi: TComprobantes, lugarExpedicion: string): Promise<TErrorOutput | undefined> {
    return this.runValidations([
      () => this.existNode(data, "receptor"),
      () => this.validateRfc(data?.rfc, "receptor"),
      () => this.validateName(data?.nombre, "receptor", data!.rfc),
      () => this.validateDomFiscal(data?.domicilioFiscal, data!.rfc, lugarExpedicion),
      async () => await this.validateRegFiscal(data?.regimenFiscal, "receptor", data!.rfc),
      async () => await this.validateUsoCfdi(data?.usoCfdi, data!.regimenFiscal),
      () => this.validateNumRegIdTrib(data?.numRegIdTrib, data!.rfc),
      async () => await this.validateResFiscal(data?.residenciaFiscal, data!.rfc, data!.numRegIdTrib),
    ]);
  }
  private async validateNodeInformacionGlobal(
    data: INodeInformacionGlobal | undefined,
    rfc_receptor: string,
    name_receptor: string,
    regFiscal_receptor: string
  ): Promise<TErrorOutput | undefined> {
    return this.runValidations([
      () => this.existNode(data, "informacionGlobal", { rfc: rfc_receptor, name: name_receptor }),
      () => this.validatePeriodicidad(data?.periodicidad, regFiscal_receptor),
    ]);
  }
  private handleValidation(result: TErrorOutput | undefined): void {
    if (result) {
      throw new FacturaError(result.message, result.code, result.codeSat);
    }
  }
  private existNode(data: any, name: string, options?: Record<string, string>): TErrorOutput | undefined {
    if (data) return undefined;
    switch (name) {
      case "comprobante":
        return comprobante_errors.find((i) => i.code === "CSN400001");
      case "receptor":
        return receptor_errors.find((i) => i.code === "CSN401001");
      case "emisor":
        return emisor_errors.find((i) => i.code === "CSN402001");
      case "informacionGlobal":
        if ((options as any).rfc === "XAXX010101000" && (options as any).name.toUpperCase() === "PUBLICO EN GENERAL")
          return infGlobal_errors.find((i) => i.code === "CSN403001");
        break;
      default:
        return comprobante_errors.find((i) => i.code === "CSN400000");
    }
  }
  private validatePeriodicidad(data: string | undefined, reg_fiscal: string): TErrorOutput | undefined {
    const res = this.validateValue(data, { not_includes_in: ["01", "02", "03", "04", "05"], includes_in: ["05"] });
    switch (res) {
      case "undefined":
        return this.getError("infGlobal_errors", "CSN403010");
      case "type":
        return this.getError("infGlobal_errors", "CSN403011");
      case "empty":
        return this.getError("infGlobal_errors", "CSN403012");
      case "not_includes_in":
        return this.getError("infGlobal_errors", "CSN403013");
      case "includes_in":
        if (reg_fiscal !== "621") return this.getError("infGlobal_errors", "CSN403014");
        break;
    }
  }
  private validateFacAtrAdquirente(value: string | undefined): TErrorOutput | undefined {
    const res = this.validateValue(value);
    switch (res) {
      case "type":
        return this.getError("emisor_errors", "CSN402040");
      case "empty":
        return this.getError("emisor_errors", "CSN402041");
    }
  }
  private validateNumRegIdTrib(value: string | undefined, rfc: string): TErrorOutput | undefined {
    const res = this.validateValue(value);
    switch (res) {
      case "undefined":
        if (rfc === "XEXX010101000") return this.getError("receptor_errors", "CSN401070");
        break;
      case "type":
        return this.getError("receptor_errors", "CSN401071");
      case "empty":
        return this.getError("receptor_errors", "CSN401072");
      case "exist":
        if (rfc !== "XEXX010101000") return this.getError("receptor_errors", "CSN401073");
        break;
    }
  }
  private async validateResFiscal(value: string | undefined, rfc: string, numReg?: string): Promise<TErrorOutput | undefined> {
    const res = this.validateValue(value);
    switch (res) {
      case "undefined":
        if (rfc === "XEXX010101000" || numReg) return this.getError("receptor_errors", "CSN401060");
        break;
      case "type":
        return this.getError("receptor_errors", "CSN401061");
      case "empty":
        return this.getError("receptor_errors", "CSN401062");
      case "exist":
        if (value!.toUpperCase() === "MEX") return this.getError("receptor_errors", "CSN401063");
        try {
          await new CatalogoSat("pais").search("clave", value!);
        } catch (error: any) {
          if (error.message === "Not found") return this.getError("receptor_errors", "CSN401064");
        }
        break;
    }
  }
  private async validateUsoCfdi(value: string | undefined, rf: string): Promise<TErrorOutput | undefined> {
    const res = this.validateValue(value);
    switch (res) {
      case "undefined":
        return this.getError("receptor_errors", "CSN401050");
      case "type":
        return this.getError("receptor_errors", "CSN401051");
      case "empty":
        return this.getError("receptor_errors", "CSN401052");
      case "exist":
        try {
          const result = await new CatalogoSat("usocfdi").search("clave", value!);
          const regs = result.regimen_receptor.split(",").map((r: any) => r.trim());
          if (!regs.includes(rf)) return this.getError("receptor_errors", "CSN401053");
        } catch (error: any) {
          if (error.message === "Not found") return this.getError("receptor_errors", "CSN401054");
        }
        break;
    }
  }
  private async validateRegFiscal(value: string | undefined, type: TEmiRec, rfc: string): Promise<TErrorOutput | undefined> {
    const res = this.validateValue(value);
    switch (res) {
      case "undefined":
        return type === "receptor" ? this.getError("receptor_errors", "CSN401040") : this.getError("emisor_errors", "CSN402030");
      case "type":
        return type === "receptor" ? this.getError("receptor_errors", "CSN401041") : this.getError("emisor_errors", "CSN402031");
      case "empty":
        return type === "receptor" ? this.getError("receptor_errors", "CSN401042") : this.getError("emisor_errors", "CSN402032");
      case "exist":
        if (type === "receptor" && ["XAXX010101000", "XEXX010101000"].includes(rfc) && value !== "616") return this.getError("receptor_errors", "CSN401043");
        try {
          const result = await new CatalogoSat("regimenfiscal").search("clave", value!);
          if ((rfc.length === 12 && result.moral === "No") || (rfc.length === 13 && result.fisica === "No"))
            return type === "receptor" ? this.getError("receptor_errors", "CSN401044") : this.getError("emisor_errors", "CSN402033");
        } catch (error: any) {
          if (error.message === "Not found")
            return type === "receptor" ? this.getError("receptor_errors", "CSN401045") : this.getError("emisor_errors", "CSN402034");
        }
        break;
    }
  }
  private validateDomFiscal(value: string | undefined, rfc?: string, lugarExpedicion?: string): TErrorOutput | undefined {
    const res = this.validateValue(value);
    switch (res) {
      case "undefined":
        return this.getError("receptor_errors", "CSN401030");
      case "type":
        return this.getError("receptor_errors", "CSN401031");
      case "empty":
        return this.getError("receptor_errors", "CSN401032");
    }
    if (["XAXX010101000", "XEXX010101000"].includes(rfc!) && value !== lugarExpedicion) return this.getError("receptor_errors", "CSN401033");
  }
  private validateRfc(value: string | undefined, type: TEmiRec): TErrorOutput | undefined {
    const res = this.validateValue(value, { regex_failed: /^([A-ZÑ&]{3,4})(\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[A-Z\d]{2}[A\d]$/ });
    switch (res) {
      case "undefined":
        return type === "receptor" ? this.getError("receptor_errors", "CSN401010") : this.getError("emisor_errors", "CSN402010");
      case "type":
        return type === "receptor" ? this.getError("receptor_errors", "CSN401011") : this.getError("emisor_errors", "CSN402011");
      case "empty":
        return type === "receptor" ? this.getError("receptor_errors", "CSN401012") : this.getError("emisor_errors", "CSN402012");
      case "regex_failed":
        return type === "receptor" ? this.getError("receptor_errors", "CSN401013") : this.getError("emisor_errors", "CSN402013");
    }
  }
  private validateName(value: string | undefined, type: TEmiRec, rfc?: string): TErrorOutput | undefined {
    const res = this.validateValue(value, { max_length: 254 });
    switch (res) {
      case "undefined":
        return type === "receptor" ? this.getError("receptor_errors", "CSN401020") : this.getError("emisor_errors", "CSN402020");
      case "type":
        return type === "receptor" ? this.getError("receptor_errors", "CSN401021") : this.getError("emisor_errors", "CSN402021");
      case "empty":
        return type === "receptor" ? this.getError("receptor_errors", "CSN401022") : this.getError("emisor_errors", "CSN402022");
      case "max_length":
        return type === "receptor" ? this.getError("receptor_errors", "CSN401023") : this.getError("emisor_errors", "CSN402023");
    }
    if (type === "receptor" && rfc !== "XAXX010101000" && value!.toUpperCase() === "PUBLICO EN GENERAL") return this.getError("receptor_errors", "CSN401024");
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
        case "exist":
          try {
            await new CatalogoSat("formapago").search("clave", value!);
          } catch (error: any) {
            if (error.message === "Not found") return this.getError("comprobante_errors", "CSN400055");
          }
          break;
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
      case "exist":
        try {
          await new CatalogoSat("moneda").search("clave", value ?? "MXN");
        } catch (error: any) {
          if (error.message === "Not found") return this.getError("comprobante_errors", "CSN400092");
        }
        break;
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
      case "exist":
        try {
          await new CatalogoSat("exportacion").search("clave", value!);
        } catch (error: any) {
          if (error.message === "Not found") return this.getError("comprobante_errors", "CSN400112");
        }
        break;
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
      case "exist":
        try {
          await new CatalogoSat("codigopostalparteuno").search("codigo_postal", value!);
        } catch {
          try {
            await new CatalogoSat("codigopostalpartedos").search("codigo_postal", value!);
          } catch (error: any) {
            if (error.message === "Not found") return this.getError("comprobante_errors", "CSN400133");
          }
        }
        break;
    }
  }
  private getError(name_group: string, code: string): TErrorOutput | undefined {
    if (name_group === "comprobante_errors") return comprobante_errors.find((i) => i.code === code);
    if (name_group === "receptor_errors") return receptor_errors.find((i) => i.code === code);
    if (name_group === "emisor_errors") return emisor_errors.find((i) => i.code === code);
    if (name_group === "infGlobal_errors") return infGlobal_errors.find((i) => i.code === code);
  }
}
export default CfdiValidator;
