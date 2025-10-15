import { TErrorOutput } from "../types/TValidator";

interface IOptionsValidateValue {
  includes_in?: any[];
  not_includes_in?: any[];
  regex_failed?: RegExp;
  regex_success?: RegExp;
  date_greater_than?: Date;
  is_number?: boolean;
  number_less_than?: number;
  number_greater_than?: number;
  min_length?: number;
  max_length?: number;
}
type TValidateValue =
  | ""
  | "exist"
  | "undefined"
  | "type"
  | "empty"
  | "includes_in"
  | "not_includes_in"
  | "regex_failed"
  | "regex_success"
  | "date_greater_than"
  | "no_is_number"
  | "number_less_than"
  | "number_greater_than"
  | "min_length"
  | "max_length";

class Validator {
  public async runValidations(validations: Array<() => TErrorOutput | undefined | Promise<TErrorOutput | undefined>>): Promise<TErrorOutput | undefined> {
    for (const validate of validations) {
      const result = await validate();
      if (result) return result;
    }
    return undefined;
  }
  public validateValue(value: any, options?: IOptionsValidateValue): TValidateValue {
    if (value === undefined) return "undefined";

    if (!["string", "number"].includes(typeof value)) return "type";

    if (value.toString().trim() === "") return "empty";
    if (options) {
      return this.validateValueWithOptions(value, options);
    }

    return "exist";
  }
  private validateValueWithOptions(value: any, options: IOptionsValidateValue): TValidateValue {
    if ("includes_in" in options && options.includes_in?.includes(value)) return "includes_in";
    if ("not_includes_in" in options && !options.not_includes_in?.includes(value)) return "not_includes_in";
    if ("regex_failed" in options && options.regex_failed?.test(value) === false) return "regex_failed";
    if ("regex_success" in options && options.regex_success?.test(value) === true) return "regex_success";
    if ("date_greater_than" in options && new Date(value) > options.date_greater_than!) return "date_greater_than";
    if ("is_number" in options && options.is_number === true && isNaN(Number(value))) return "no_is_number";
    if ("number_less_than" in options && !isNaN(Number(value)) && Number(value) < options.number_less_than!) return "number_less_than";
    if ("number_greater_than" in options && !isNaN(Number(value)) && Number(value) > options.number_greater_than!) return "number_greater_than";
    if ("min_length" in options && value.toString().length < options.min_length!) return "min_length";
    if ("max_length" in options && value.toString().length > options.max_length!) return "max_length";
    return "";
  }
}
export default Validator;
