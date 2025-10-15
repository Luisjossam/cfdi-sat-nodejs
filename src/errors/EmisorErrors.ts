import ErrorBuilder from "../core/builders/ErrorBuilder";
import { TErrorOutput } from "../types/TValidator";

const emisor_errors: TErrorOutput[] = [
  {
    code: "CSN402001",
    codeSat: "",
    message: ErrorBuilder.nodeUndefined("createNodeEmisor"),
  },
  // RFC
  {
    code: "CSN402010",
    codeSat: "",
    message: ErrorBuilder.undefinedValue("rfc", "del emisor"),
  },
  {
    code: "CSN402011",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("rfc", ["string"], "del emisor"),
  },
  {
    code: "CSN402012",
    codeSat: "",
    message: ErrorBuilder.emptyValue("rfc", "del emisor"),
  },
  {
    code: "CSN402013",
    codeSat: "",
    message: ErrorBuilder.valueNotMeetPattern("rfc", "([A-ZÑ&]{3,4})(d{2})(0[1-9]|1[0-2])(0[1-9]|[12]d|3[01])[A-Zd]{2}[Ad]", "del emisor"),
  },
  // NOMBRE
  {
    code: "CSN402020",
    codeSat: "",
    message: ErrorBuilder.undefinedValue("nombre", "del emisor"),
  },
  {
    code: "CSN402021",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("nombre", ["string"], "del emisor"),
  },
  {
    code: "CSN402022",
    codeSat: "",
    message: ErrorBuilder.emptyValue("nombre", "del emisor"),
  },
  {
    code: "CSN402023",
    codeSat: "",
    message: ErrorBuilder.valueMaxLength("nombre", 254, "del emisor"),
  },
  // REGIMEN FISCAL
  {
    code: "CSN402030",
    codeSat: "",
    message: ErrorBuilder.undefinedValue("regimenFiscal", "del emisor"),
  },
  {
    code: "CSN402031",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("regimenFiscal", ["string"], "del emisor"),
  },
  {
    code: "CSN402032",
    codeSat: "",
    message: ErrorBuilder.emptyValue("regimenFiscal", "del emisor"),
  },
  {
    code: "CSN402033",
    codeSat: "CFDI40141",
    message: 'El valor que se registre en la propiedad "regimenFiscal" del emisor debe corresponder con el tipo de persona del emisor.',
  },
  {
    code: "CSN402034",
    codeSat: "CFDI40140",
    message: ErrorBuilder.valueNotFoundInCatalog("regimenFiscal", "c_RegimenFiscal", "del emisor"),
  },
  // FACATRADQUIRENTE
  {
    code: "CSN402040",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("facAtrAdquirente", ["string"]),
  },
  {
    code: "CSN402041",
    codeSat: "",
    message: ErrorBuilder.emptyValue("facAtrAdquirente"),
  },
];
export default emisor_errors;
