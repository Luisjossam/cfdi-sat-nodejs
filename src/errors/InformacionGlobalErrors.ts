import ErrorBuilder from "../core/builders/ErrorBuilder";
import { TErrorOutput } from "../types/TValidator";

const infGlobal_errors: TErrorOutput[] = [
  {
    code: "CSN403001",
    codeSat: "CFDI40130",
    message:
      'El método "createNodeInformacionGlobal()" debe existir siempre que el Rfc del receptor contiene el valor "XAXX010101000" y el valor de la propiedad "nombre" del receptor contiene el valor “PUBLICO EN GENERAL”.',
  },
  // PERIODICIDAD
  {
    code: "CSN403010",
    codeSat: "",
    message: ErrorBuilder.undefinedValue("periodicidad"),
  },
  {
    code: "CSN403011",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("periodicidad", ["string"]),
  },
  {
    code: "CSN403012",
    codeSat: "",
    message: ErrorBuilder.emptyValue("periodicidad"),
  },
  {
    code: "CSN403013",
    codeSat: "CFDI40131",
    message: ErrorBuilder.valueNotFoundInCatalog("periodicidad", "c_Periodicidad"),
  },
  {
    code: "CSN403014",
    codeSat: "CFDI40132",
    message:
      'Cuando el valor de la propiedad "periodicidad" contiene la clave “05” el valor valor de la propiedad "regimenFiscal" del receptor debe contener el valor “621”.',
  },
];
export default infGlobal_errors;
