import { INodeComprobante } from "../interfaces/IFacturaCfdi";
import Validator from "./Validator";
import {
  errors_descuento,
  errors_exportacion,
  errors_fecha,
  errors_folio,
  errors_forma_pago,
  errors_metodo_pago,
  errors_serie,
  errors_subtotal,
  errors_tipo_cambio,
  errors_tipo_comprobante,
  errors_total,
} from "../utils/errors_factura_cfdi";
import Utils from "./Utils";
import CatalogoSat from "./CatalogoSat";
interface IError {
  code: string;
  message: string;
}
type nodesTypes = "comprobante";
const tiposComprobante = ["I", "E", "P", "T"];
class ValidatorFacturaCfdi<T extends Record<string, any>> extends Validator {
  private readonly type: nodesTypes | null = null;
  constructor(type: nodesTypes, private readonly data: T) {
    super();
    this.type = type;
  }
  async run() {
    switch (this.type) {
      case "comprobante":
        await this.validateNodeComprobante();
        break;
      default:
        return [];
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

    err_code = this.validateFormaPago(data.formaPago, data.tipoDeComprobante ?? "I", data.metodoPago);
    if (err_code !== "") return this.setErrors(errors_forma_pago.find((i) => i.code === err_code)!);

    err_code = this.validateSubtotal(data.subtotal, data.tipoDeComprobante ?? "I");
    if (err_code !== "") return this.setErrors(errors_subtotal.find((i) => i.code === err_code)!);

    err_code = this.validateDescuento(data.descuento, data.subtotal, data.tipoDeComprobante ?? "I");
    if (err_code !== "") return this.setErrors(errors_descuento.find((i) => i.code === err_code)!);

    err_code = this.validateTipoCambio(data.tipoCambio, data.moneda ?? "MXN");
    if (err_code !== "") return this.setErrors(errors_tipo_cambio.find((i) => i.code === err_code)!);

    err_code = this.validateTotal(data.total, data.tipoDeComprobante ?? "I");
    if (err_code !== "") return this.setErrors(errors_total.find((i) => i.code === err_code)!);

    err_code = await this.validateExportacion(data.exportacion ?? "01");

    if (err_code !== "") return this.setErrors(errors_exportacion.find((i) => i.code === err_code)!);
  }
  private validateTipoComprobante(tipo_comprobante: string | undefined): string {
    if (typeof tipo_comprobante !== "string") {
      return "CSN40106";
    }
    if (!tiposComprobante.includes(tipo_comprobante)) {
      return "CSN40107";
    }
    return "";
  }
  private validateSerie(serie: string | undefined): string {
    if (serie === undefined) {
      return "CSN40108";
    } else {
      if (typeof serie !== "string") {
        return "CSN40109";
      }
      if (serie.trim() === "") {
        return "CSN40110";
      }
    }
    return "";
  }
  private validateFolio(folio: string | undefined): string {
    if (folio === undefined) {
      return "CSN40111";
    } else {
      if (typeof folio !== "string") {
        return "CSN40112";
      }
      if (folio.trim() === "") {
        return "CSN40113";
      }
    }
    return "";
  }
  private validateFecha(data: string | undefined): string {
    if (!data) {
      return "CSN40115";
    } else {
      if (typeof data !== "string") {
        return "CSN40116";
      }
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(data)) {
        return "CSN40114";
      }
      if (new Date(data) > new Date(Utils.dateCurrent())) {
        return "CSN40117";
      }
      const date = new Date(data);
      const today = new Date();
      if (date.getMonth() !== today.getMonth() || date.getFullYear() !== today.getFullYear()) {
        return "CSN40118";
      }
    }
    return "";
  }
  private validateMetodoPago(mp: string | undefined, tipo_comprobante: `I` | `E` | `P` | `T` | `N`): string {
    if (["I", "E", "N"].includes(tipo_comprobante)) {
      if (mp === undefined) return "CSN40125";
      if (!["string"].includes(typeof mp)) return "CSN40126";
      if (mp === "") return "CSN40127";
      if (!["PPD", "PUE"].includes(mp)) return "CSN40128";
    }
    if (["P", "T"].includes(tipo_comprobante) && mp !== undefined) return "CSN40129";
    return "";
  }
  private validateFormaPago(data: string | number | undefined, tipo_comprobante: `I` | `E` | `P` | `T` | "N", mp: "PPD" | "PUE" | undefined): string {
    if (["I", "E"].includes(tipo_comprobante)) {
      if (data === undefined) {
        return "CSN40122";
      }
      if (!["string", "number"].includes(typeof data)) {
        return "CSN40123";
      }
      if (data.toString() === "") {
        return "CSN40124";
      }
      if (data.toString() !== "99" && mp === "PPD") {
        return "CSN40121";
      }
    }
    if (["P", "N", "T"].includes(tipo_comprobante) && data !== undefined) {
      return "CSN40119";
    }
    return "";
  }
  private validateSubtotal(subtotal: string | number | undefined, tipo_comprobante: `I` | `E` | `P` | `T` | "N"): string {
    if (subtotal === undefined) return "CSN40130";
    if (!["string", "number"].includes(typeof subtotal)) return "CSN40131";
    if (subtotal === "") return "CSN40132";
    if (["T", "P"].includes(tipo_comprobante)) {
      if (parseFloat(subtotal.toString()) > 0) return "CSN40133";
    }
    return "";
  }
  private validateDescuento(descuento: string | number | undefined, subtotal: string | number, tipo_comprobante: `I` | `E` | `P` | `T` | "N"): string {
    if (descuento !== undefined) {
      if (["T", "P"].includes(tipo_comprobante)) return "CSN40136";
      if (!["string", "number"].includes(typeof descuento)) return "CSN40134";
      if (parseFloat(descuento.toString()) < 0) return "CSN40135";
      if (parseFloat(descuento.toString()) > parseFloat(subtotal.toString())) return "CSN40137";
      return "";
    } else {
      return "";
    }
  }
  private validateTipoCambio(tipo_cambio: string | number | undefined, moneda: string): string {
    if (tipo_cambio !== undefined && !["string", "number"].includes(typeof tipo_cambio)) return "CSN40138";
    if (tipo_cambio !== undefined && tipo_cambio === "") return "CSN40143";
    if (!["MXN", "XXX"].includes(moneda) && tipo_cambio === undefined) return "CSN40139";
    if (moneda === "MXN" && tipo_cambio !== undefined && parseFloat(tipo_cambio.toString()) !== 1) return "CSN40140";
    if (moneda === "XXX" && tipo_cambio !== undefined) return "CSN40141";
    if (tipo_cambio !== undefined && !/^[0-9]{1,18}(\.[0-9]{1,6})?$/.test(tipo_cambio.toString())) return "CSN40142";
    return "";
  }
  private validateTotal(total: string | number | undefined, tipo_comprobante: string): string {
    if (total === undefined) return "CSN40144";
    if (!["string", "number"].includes(typeof total)) return "CSN40145";
    if (total.toString().trim() === "") return "CSN40146";
    if (tipo_comprobante === "T") return "CSN40147";
    return "";
  }
  private async validateExportacion(exportacion: string): Promise<string> {
    if (typeof exportacion !== "string") return "CSN40148";
    if (exportacion.trim() === "") return "CSN40149";

    try {
      const value_exist = await new CatalogoSat("exportacion").search("clave", exportacion);
      console.log(value_exist);
    } catch (error: any) {
      if (error.message === "Not found") return "CFDI40123";
    }
    return "";
  }
}
export default ValidatorFacturaCfdi;
