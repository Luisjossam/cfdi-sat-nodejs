import Utils from "../../classes/Utils";
import comprobante_errors from "../../errors/ComprobanteErrors";
import { TErrors, TNComprobanteFechaErrorOutput, TNodeComprobanteErrorOutput } from "../../types/TValidator";
import Validator from "../Validator";

class CfdiValidator {
  public static existNode(node: any, code: TErrors): TNodeComprobanteErrorOutput {
    if (node === undefined) {
      return comprobante_errors;
    }
    return { code: "" };
  }
  public static fecha(value: string | undefined): TNodeComprobanteErrorOutput {
    const result = Validator.validateValue(value, {
      regex_failed: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
      date_greater_than: new Date(Utils.dateCurrent()),
    });
    switch (result.error_type) {
      case "undefined":
        return "CSN400002";
      case "type":
        return "CSN400003";
      case "empty":
        return "CSN400004";
      case "regex_failed":
        return "CSN400005";
      case "date_greater_than":
        return "CSN400006";
    }
    return "";
  }
}
export default CfdiValidator;
