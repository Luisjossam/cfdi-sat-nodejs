interface IError {
  code: string;
  message: string;
}
interface IValidateValue {
  error_type: "" | "undefined" | "type" | "empty" | "includes_in" | "not_includes_in" | "regex_failed" | "regex_success" | "date_greater_than" | "no_is_number";
}
interface IOptionsValidateValue {
  includes_in?: any[];
  not_includes_in?: any[];
  regex_failed?: RegExp;
  regex_success?: RegExp;
  date_greater_than?: Date;
  is_number?: boolean;
}
class Validator {
  private errors: IError[] = [];
  getErrors() {
    return this.errors;
  }
  setErrors(errors: IError) {
    this.errors = [errors];
  }
  public static validateRfc(rfc: string): boolean {
    const regex = /^([A-ZÑ&]{3,4})-?([0-9]{2})([0-1][0-9])([0-3][0-9])-?([A-Z\d]{3})$/i;
    return regex.test(rfc);
  }
  public static validateIdCcp(IdCcp: string) {
    const regex = /^C{3}[a-f0-9A-F]{5}-[a-f0-9A-F]{4}-[a-f0-9A-F]{4}-[a-f0-9A-F]{4}-[a-f0-9A-F]{12}$/;
    return regex.test(IdCcp);
  }
  public validateValue(value: any, options?: IOptionsValidateValue): IValidateValue {
    if (value === undefined) return { error_type: "undefined" };
    if (typeof value !== "string") return { error_type: "type" };
    if (value.trim() === "") return { error_type: "empty" };
    if (options) {
      return this.validateValueWithOptions(value, options);
    }
    return { error_type: "" };
  }
  public validateValueWithOptions(value: any, options: IOptionsValidateValue): IValidateValue {
    if ("includes_in" in options && options.includes_in?.includes(value)) return { error_type: "includes_in" };
    if ("not_includes_in" in options && !options.not_includes_in?.includes(value)) return { error_type: "not_includes_in" };
    if ("regex_failed" in options && options.regex_failed?.test(value) === false) return { error_type: "regex_failed" };
    if ("regex_success" in options && options.regex_success?.test(value) === true) return { error_type: "regex_success" };
    if ("date_greater_than" in options && new Date(value) > options.date_greater_than!) return { error_type: "date_greater_than" };
    if ("is_number" in options && options.is_number === true && isNaN(Number(value))) return { error_type: "no_is_number" };
    return { error_type: "" };
  }
}
export default Validator;
