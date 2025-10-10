import comprobante_errors from "../errors/ComprobanteErrors";
import { INodeComprobante } from "../interfaces/ICfdi";
import { TNodeComprobanteErrorOutput } from "../types/TValidator";
import Cfdi from "./Cfdi";
import FacturaError from "./errors/FacturaError";
import CfdiValidator from "./Validators/CfdiValidator";

class Validator {
  public static async validateCfdi(cfdi: Cfdi): Promise<void> {
    this.handleValidation(this.validateNodeComprobante(cfdi.getDataComprobante()));
  }
  private static handleValidation(result: TNodeComprobanteErrorOutput): void {
    if (result.code !== "") {
      throw new FacturaError(result.message!, result.code, result.codeSat, result.solution);
    }
  }
  private static validateNodeComprobante(data: INodeComprobante | undefined): TNodeComprobanteErrorOutput {
    return this.runValidations([() => CfdiValidator.existNode(data, "CSN400001"), () => CfdiValidator.fecha(data?.fecha)]);
  }
  private static runValidations(validations: (() => TNodeComprobanteErrorOutput)[]): TNodeComprobanteErrorOutput {
    for (const validate of validations) {
      const result = validate();
      if (result.code !== "") return result;
    }
    return { code: "" };
  }
}
export default Validator;
