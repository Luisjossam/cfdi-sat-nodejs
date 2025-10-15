import ErrorBuilder from "../core/builders/ErrorBuilder";
import { TErrorOutput } from "../types/TValidator";

const receptor_errors: TErrorOutput[] = [
  {
    code: "CSN401000",
    codeSat: "",
    message: "Error desconocido",
  },
  {
    code: "CSN401001",
    codeSat: "",
    message: ErrorBuilder.nodeUndefined("createNodeReceptor"),
  },
  // RFC
  {
    code: "CSN401010",
    codeSat: "",
    message: ErrorBuilder.undefinedValue("rfc", "del receptor"),
  },
  {
    code: "CSN401011",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("rfc", ["string"], "del receptor"),
  },
  {
    code: "CSN401012",
    codeSat: "",
    message: ErrorBuilder.emptyValue("rfc", "del receptor"),
  },
  {
    code: "CSN401013",
    codeSat: "",
    message: ErrorBuilder.valueNotMeetPattern("rfc", "([A-ZÑ&]{3,4})(d{2})(0[1-9]|1[0-2])(0[1-9]|[12]d|3[01])[A-Zd]{2}[Ad]", "del receptor"),
  },
  //NOMBRE
  {
    code: "CSN401020",
    codeSat: "",
    message: ErrorBuilder.undefinedValue("nombre", "del receptor"),
  },
  {
    code: "CSN401021",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("nombre", ["string"], "del receptor"),
  },
  {
    code: "CSN401022",
    codeSat: "",
    message: ErrorBuilder.emptyValue("nombre", "del receptor"),
  },
  {
    code: "CSN401023",
    codeSat: "",
    message: ErrorBuilder.valueMaxLength("nombre", 254, "del receptor"),
  },
  {
    code: "CSN401024",
    codeSat: "CFDI40146",
    message:
      'Si el valor registrado en la propiedad "nombre" del receptor es “PUBLICO EN GENERAL”, el valor de la propiedad "rfc" del receptor debe ser “XAXX010101000”.',
  },
  // DOM FISCAL
  {
    code: "CSN401030",
    codeSat: "",
    message: ErrorBuilder.undefinedValue("domicilioFiscal", "del receptor"),
  },
  {
    code: "CSN401031",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("domicilioFiscal", ["string"], "del receptor"),
  },
  {
    code: "CSN401032",
    codeSat: "",
    message: ErrorBuilder.emptyValue("domicilioFiscal", "del receptor"),
  },
  {
    code: "CSN401033",
    codeSat: "CFDI40149",
    message:
      'Si el valor de la propiedad "rfc" del receptor es "XAXX010101000" o "XEXX010101000", el valor de la propiedad "domicilioFiscal" del receptor debe ser igual al valor de la propiedad "LugarExpedicion".',
  },
  //REGIMEN FISCAL
  {
    code: "CSN401040",
    codeSat: "",
    message: ErrorBuilder.undefinedValue("regimenFiscal", "del receptor"),
  },
  {
    code: "CSN401041",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("regimenFiscal", ["string"], "del receptor"),
  },
  {
    code: "CSN401042",
    codeSat: "",
    message: ErrorBuilder.emptyValue("regimenFiscal", "del receptor"),
  },
  {
    code: "CSN401043",
    codeSat: "CFDI40159",
    message:
      'Si el valor de la propiedad "rfc" del receptor contiene el valor “XAXX010101000” o el valor “XEXX010101000”, el valor de la propiedad "regimenFiscal" del receptor se debe registrar la clave “616”',
  },
  {
    code: "CSN401044",
    codeSat: "CFDI40158",
    message: 'El valor que se registre en la propiedad "regimenFiscal" del receptor debe corresponder con el tipo de persona del receptor.',
  },
  {
    code: "CSN401045",
    codeSat: "CFDI40157",
    message: ErrorBuilder.valueNotFoundInCatalog("regimenFiscal", "c_RegimenFiscal", "del receptor"),
  },
  //USO CFDI
  {
    code: "CSN401050",
    codeSat: "",
    message: ErrorBuilder.undefinedValue("usoCfdi", "del receptor"),
  },
  {
    code: "CSN401051",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("usoCfdi", ["string"], "del receptor"),
  },
  {
    code: "CSN401052",
    codeSat: "",
    message: ErrorBuilder.emptyValue("usoCfdi", "del receptor"),
  },
  {
    code: "CSN401053",
    codeSat: "CFDI40161",
    message:
      'El valor de la propiedad "usoCfdi" debe aplicar para el tipo de persona del receptor y el régimen correspondiente conforme al catálogo c_UsoCFDI.',
  },
  {
    code: "CSN401054",
    codeSat: "CFDI40160",
    message: ErrorBuilder.valueNotFoundInCatalog("usoCfdi", "c_UsoCFDI", "del receptor"),
  },
  // RESIDENCIA FISCAL
  {
    code: "CSN401060",
    codeSat: "CFDI40153",
    message:
      'Si el RFC del receptor es un RFC genérico extranjero y el comprobante incluye el complemento de comercio exterior, o se registró valor en la propiedad "numRegIdTrib" del receptor, debe existir la propiedad "residenciaFiscal" del receptor.',
  },
  {
    code: "CSN401061",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("residenciaFiscal", ["string"], "del receptor"),
  },
  {
    code: "CSN401062",
    codeSat: "",
    message: ErrorBuilder.emptyValue("residenciaFiscal", "del receptor"),
  },
  {
    code: "CSN401063",
    codeSat: "CFDI40152",
    message: 'El valor de la propiedad "residenciaFiscal" del receptor no puede ser MEX.',
  },
  {
    code: "CSN401064",
    codeSat: "CFDI40150",
    message: ErrorBuilder.valueNotFoundInCatalog("residenciaFiscal", "c_Pais", "del receptor"),
  },
  // NUMERO REGISTRO ID TRIBUTARIO
  {
    code: "CSN401070",
    codeSat: "CFDI40155",
    message:
      'Si el RFC del receptor es un RFC genérico extranjero y el comprobante incluye el complemento de comercio exterior, debe existir la propiedad "numRegIdTrib".',
  },
  {
    code: "CSN401071",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("numRegIdTrib", ["string"], "del receptor"),
  },
  {
    code: "CSN401072",
    codeSat: "",
    message: ErrorBuilder.emptyValue("numRegIdTrib", "del receptor"),
  },
  {
    code: "CSN401073",
    codeSat: "CFDI40154",
    message:
      'Si el valor de la propiedad "rfc" del receptor es un RFC inscrito no cancelado en el SAT o un RFC genérico nacional, no se debe registrar la propiedad "numRegIdTrib".',
  },
];
export default receptor_errors;
