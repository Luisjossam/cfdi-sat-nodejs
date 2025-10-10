import ErrorBuilder from "../core/builders/ErrorBuilder";
import { TErrorOutput } from "../types/TValidator";

const comprobante_errors: TErrorOutput[] = [
  {
    code: "CSN400000",
    codeSat: "",
    message: "Error desconocido",
  },
  {
    code: "CSN400001",
    codeSat: "",
    message: ErrorBuilder.nodeUndefined("createNodeComprobante"),
  },
  // Fecha
  {
    code: "CSN400010",
    codeSat: "",
    message: ErrorBuilder.undefinedValue("fecha"),
  },
  {
    code: "CSN400011",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("fecha", ["string"]),
  },
  {
    code: "CSN400012",
    codeSat: "",
    message: ErrorBuilder.emptyValue("fecha"),
  },
  {
    code: "CSN400013",
    codeSat: "CFDI40101",
    message: ErrorBuilder.valueNotMeetPattern("fecha", "YYYY-MM-DDTHH:mm:ss"),
  },
  {
    code: "CSN400014",
    codeSat: "",
    message: "La fecha ingresada es superior a la fecha y hora actual.",
  },
  {
    code: "CSN400015",
    codeSat: "",
    message: "La fecha no pertenece al mes vigente.",
  },
  // SERIE
  {
    code: "CSN400020",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("serie", ["string"]),
  },
  {
    code: "CSN400021",
    codeSat: "",
    message: ErrorBuilder.emptyValue("serie"),
  },
  {
    code: "CSN400022",
    codeSat: "",
    message: ErrorBuilder.valueMinLength("serie", 1),
  },
  {
    code: "CSN400023",
    codeSat: "",
    message: ErrorBuilder.valueMaxLength("serie", 25),
  },
  // FOLIO
  {
    code: "CSN400030",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("folio", ["string"]),
  },
  {
    code: "CSN400031",
    codeSat: "",
    message: ErrorBuilder.emptyValue("folio"),
  },
  {
    code: "CSN400032",
    codeSat: "",
    message: ErrorBuilder.valueMinLength("folio", 1),
  },
  {
    code: "CSN400033",
    codeSat: "",
    message: ErrorBuilder.valueMaxLength("folio", 40),
  },
  // METODO PAGO
  {
    code: "CSN400040",
    codeSat: "CFDI40125",
    message: 'Si existe el tipo de comprobante P o T, la propiedad "metodoPago" no debe existir.',
  },
  {
    code: "CSN400041",
    codeSat: "",
    message: ErrorBuilder.undefinedValue("metodoPago"),
  },
  {
    code: "CSN400042",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("metodoPago", ["string"]),
  },
  {
    code: "CSN400043",
    codeSat: "",
    message: ErrorBuilder.emptyValue("metodoPago"),
  },
  {
    code: "CSN400044",
    codeSat: "CFDI40124",
    message: ErrorBuilder.valueNotFoundInCatalog("metodoPago", "c_MetodoPago"),
  },
  // FORMA PAGO
  {
    code: "CSN400050",
    codeSat: "CFDI40103",
    message: 'Si existe el tipo de comprobante T, N o P, la propiedad "formaPago" no debe existir.',
  },
  {
    code: "CSN400051",
    codeSat: "",
    message: ErrorBuilder.undefinedValue("formaPago"),
  },
  {
    code: "CSN400052",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("formaPago", ["string"]),
  },
  {
    code: "CSN400053",
    codeSat: "",
    message: ErrorBuilder.emptyValue("formaPago"),
  },
  {
    code: "CSN400054",
    codeSat: "CFDI40105",
    message:
      'La propiedad "formaPago" no contiene el valor "99". Esta propiedad debe contener el valor “99” cuando la propiedad "metodoPago" contenga el valor “PPD”.',
  },
  {
    code: "CSN400055",
    codeSat: "CFDI40104",
    message: ErrorBuilder.valueNotFoundInCatalog("formaPago", "c_FormaPago"),
  },
  // Subtotal
  {
    code: "CSN400060",
    codeSat: "",
    message: ErrorBuilder.undefinedValue("subtotal"),
  },
  {
    code: "CSN400061",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("subtotal", ["number"]),
  },
  {
    code: "CSN400062",
    codeSat: "",
    message: ErrorBuilder.emptyValue("subtotal"),
  },
  {
    code: "CSN400063",
    codeSat: "CFDI40109",
    message: 'Si el tipo de comprobante es T o P, el valor de la propiedad "subtotal" debe ser igual a 0 o cero con decimales.',
  },
  // Descuento
  {
    code: "CSN400070",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("descuento", ["number"]),
  },
  {
    code: "CSN400071",
    codeSat: "",
    message: ErrorBuilder.emptyValue("descuento"),
  },
  {
    code: "CSN400072",
    codeSat: "",
    message: 'El valor de la propiedad "descuento" no debe ser menor a 0.',
  },
  {
    code: "CSN400073",
    codeSat: "",
    message: 'El valor de la propiedad "descuento" debe ser menor que el valor de la propiedad subtotal.',
  },
  {
    code: "CSN400074",
    codeSat: "CFDI40111",
    message: 'Si el tipo de comprobante es T o P, la propiedad "descuento" no debe existir.',
  },
  // TOTAL
  {
    code: "CSN400080",
    codeSat: "",
    message: ErrorBuilder.undefinedValue("total"),
  },
  {
    code: "CSN400081",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("total", ["number"]),
  },
  {
    code: "CSN400082",
    codeSat: "",
    message: ErrorBuilder.emptyValue("total"),
  },
  {
    code: "CSN400083",
    codeSat: "",
    message: 'El valor de la propiedad "total" no debe ser menor a 0.',
  },
  {
    code: "CSN400084",
    codeSat: "",
    message: 'Si el tipo de comprobante es T, el valor de la propiedad "total" debe ser igual a 0 o cero con decimales.',
  },
  // MONEDA
  {
    code: "CSN400090",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("moneda", ["string"]),
  },
  {
    code: "CSN400091",
    codeSat: "",
    message: ErrorBuilder.emptyValue("moneda"),
  },
  {
    code: "CSN400092",
    codeSat: "CFDI40113",
    message: ErrorBuilder.valueNotFoundInCatalog("moneda", "c_Moneda"),
  },
  // TIPO DE CAMBIO
  {
    code: "CSN400100",
    codeSat: "CFDI40115",
    message: ErrorBuilder.undefinedValue("tipoCambio"),
  },
  {
    code: "CSN400101",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("tipoCambio", ["number"]),
  },
  {
    code: "CSN400102",
    codeSat: "",
    message: ErrorBuilder.emptyValue("tipoCambio"),
  },
  {
    code: "CSN400103",
    codeSat: "",
    message: ErrorBuilder.valueNotMeetPattern("tipoCambio", "[0-9]{1,18}(.[0-9]{1,6})"),
  },
  {
    code: "CSN400104",
    codeSat: "CFDI40114",
    message: 'Si la moneda es MXN, puede omitirse la propiedad "tipoCambio", pero si se incluye, debe tener el valor "1".',
  },
  //EXPORTACION
  {
    code: "CSN400110",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("exportacion", ["string"]),
  },
  {
    code: "CSN400111",
    codeSat: "",
    message: ErrorBuilder.emptyValue("exportacion"),
  },
  {
    code: "CSN400112",
    codeSat: "CFDI40123",
    message: ErrorBuilder.valueNotFoundInCatalog("exportacion", "c_Exportacion"),
  },
  // CONDICIONES DE PAGO
  {
    code: "CSN400120",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("condicionesDePago", ["string"]),
  },
  {
    code: "CSN400121",
    codeSat: "",
    message: ErrorBuilder.emptyValue("condicionesDePago"),
  },
  {
    code: "CSN400122",
    codeSat: "",
    message: ErrorBuilder.valueMaxLength("condicionesDePago", 1000),
  },
  {
    code: "CSN400123",
    codeSat: "",
    message: 'Cuando el tipo de comprobante sea T, N o P, la propiedad "condicionesDePago" no debe existir.',
  },
  // LUGAR EXPEDICION
  {
    code: "CSN400130",
    codeSat: "",
    message: ErrorBuilder.undefinedValue("lugarExpedicion"),
  },
  {
    code: "CSN400131",
    codeSat: "",
    message: ErrorBuilder.valueMustBe("lugarExpedicion", ["string"]),
  },
  {
    code: "CSN400132",
    codeSat: "",
    message: ErrorBuilder.emptyValue("lugarExpedicion"),
  },
  {
    code: "CSN400133",
    codeSat: "CFDI40126",
    message: ErrorBuilder.valueNotFoundInCatalog("lugarExpedicion", "c_CodigoPostal"),
  },
];
export default comprobante_errors;
