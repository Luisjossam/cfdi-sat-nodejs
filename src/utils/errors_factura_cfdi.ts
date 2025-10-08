/**
 *
 * @param value name of property
 * @returns A string with the error message "La propiedad "{value}" no puede estar vacía."
 */
const emptyValue = (value: string): string => {
  return `La propiedad "${value}" no puede estar vacía.`;
};
/**
 *
 * @param value name of property
 * @returns A string with the error message "No existe la propiedad "{value}"."
 */
const undefinedValue = (value: string): string => {
  return `No existe la propiedad "${value}".`;
};
/**
 *
 * @param value name of property
 * @param types Array of valid types
 * @returns A string with the error message "El tipo de la propiedad "{value}" no es valido. Debe ser de tipo {types.join(" o ")}."
 */
const valueMustBe = (value: string, types: string[]): string => {
  return `El tipo de la propiedad "${value}" no es valido. Debe ser de tipo ${types.map((i) => i).join(" o ")}.`;
};
/**
 *
 * @param value name of property
 * @param pattern pattern that the property must meet
 * @returns A string with the error message "La propiedad "{value}" no cumple con el patrón requerido: {pattern}"
 */
const valueNotMeetPattern = (value: string, pattern: string): string => {
  return `La propiedad "${value}" no cumple con el patrón requerido: ${pattern}`;
};
/**
 *
 * @param value value of property
 * @param catalog name of catalog
 * @returns A string with the error message "El valor de {value} no contiene un valor del catálogo {catalog}."
 */
const valueNotFoundInCatalog = (value: string, catalog: string): string => {
  return `El valor de ${value} no contiene un valor del catálogo ${catalog}.`;
};
/**
 *
 * @param value name of property
 * @returns A string with the error message "El valor de la propiedad {value} no es un número válido."
 */
const valueIsNotNumber = (value: string): string => {
  return `El valor de la propiedad ${value} no es un número válido.`;
};
export const errors_tipo_comprobante = [
  {
    code: "CSN401001",
    message: valueMustBe("tipoDeComprobante", ["string"]),
  },
  {
    code: "CSN401002",
    message: valueNotFoundInCatalog("tipoDeComprobante", "c_TipoDeComprobante"),
  },
];
export const errors_serie = [
  {
    code: "CSN402001",
    message: undefinedValue("serie"),
  },
  {
    code: "CSN402002",
    message: valueMustBe("serie", ["string"]),
  },
  {
    code: "CSN402003",
    message: emptyValue("serie"),
  },
];
export const errors_folio = [
  {
    code: "CSN403001",
    message: undefinedValue("folio"),
  },
  {
    code: "CSN403002",
    message: valueMustBe("folio", ["string"]),
  },
  {
    code: "CSN403003",
    message: emptyValue("folio"),
  },
];
export const errors_fecha = [
  {
    code: "CSN404001",
    message: undefinedValue("fecha"),
  },
  {
    code: "CSN404002",
    message: valueNotMeetPattern("fecha", "YYYY-MM-DDTHH:mm:ss"),
  },
  {
    code: "CSN404003",
    message: valueMustBe("fecha", ["string"]),
  },
  {
    code: "CSN404004",
    message: "La fecha ingresada es superior a la fecha y hora actual.",
  },
  {
    code: "CSN404005",
    message: "La fecha no pertenece al mes vigente.",
  },
];
export const errors_forma_pago = [
  {
    code: "CSN405001",
    message: `Si existe el tipo de comprobante T, N o P, la propiedad "formaPago" no debe existir.`,
  },
  {
    code: "CSN405002",
    message: valueNotFoundInCatalog("formaPago", "c_FormaPago"),
  },
  {
    code: "CSN405003",
    message:
      'La propiedad formaPago no contiene el valor "99". Esta propiedad debe contener el valor “99” cuando la propiedad metodoPago contenga el valor “PPD”.',
  },
  {
    code: "CSN405004",
    message: undefinedValue("formaPago"),
  },
  {
    code: "CSN405005",
    message: valueMustBe("formaPago", ["string"]),
  },
  {
    code: "CSN405006",
    message: emptyValue("formaPago"),
  },
];
export const errors_metodo_pago = [
  {
    code: "CSN406001",
    message: undefinedValue("metodoPago"),
  },
  {
    code: "CSN406002",
    message: valueMustBe("metodoPago", ["string"]),
  },
  {
    code: "CSN406003",
    message: emptyValue("metodoPago"),
  },
  {
    code: "CSN406004",
    message: valueNotFoundInCatalog("metodoPago", "c_MetodoPago"),
  },
  {
    code: "CSN406005",
    message: 'Si existe el tipo de comprobante P o T, la propiedad "metodoPago" no debe existir.',
  },
];
export const errors_subtotal = [
  {
    code: "CSN407001",
    message: undefinedValue("subtotal"),
  },
  {
    code: "CSN407002",
    message: valueMustBe("subtotal", ["string", "number"]),
  },
  {
    code: "CSN407003",
    message: emptyValue("subtotal"),
  },
  {
    code: "CSN407004",
    message: "Si el tipo de comprobante es T o P, el subtotal debe ser igual a 0 o cero con decimales.",
  },
  {
    code: "CSN407005",
    message: valueIsNotNumber("subtotal"),
  },
];
export const errors_descuento = [
  {
    code: "CSN408001",
    message: valueMustBe("descuento", ["string", "number"]),
  },
  {
    code: "CSN408002",
    message: valueIsNotNumber("descuento"),
  },
  {
    code: "CSN408003",
    message: 'Si el tipo de comprobante es T o P, la propiedad "descuento" no debe existir.',
  },
  {
    code: "CSN408004",
    message: "El valor del descuento debe ser menor o igual que el valor de la propiedad subtotal.",
  },
  {
    code: "CSN408005",
    message: emptyValue("descuento"),
  },
];
export const errors_tipo_cambio = [
  {
    code: "CSN409001",
    message: valueMustBe("tipoCambio", ["string", "number"]),
  },
  {
    code: "CSN409002",
    message: 'La propiedad "tipoCambio" se debe registrar cuando la propiedad "moneda" tiene un valor distinto de MXN y XXX.',
  },
  {
    code: "CSN409003",
    message: 'La propiedad "tipoCambio" existe y no tiene el valor "1" cuando la moneda indicada o predeterminada es MXN.',
  },
  {
    code: "CSN409004",
    message: 'La propiedad "tipoCambio" no se debe registrar cuando la propiedad "moneda" tiene el valor XXX.',
  },
  {
    code: "CSN409005",
    message: valueNotMeetPattern("tipoCambio", "[0-9]{1,18}(.[0-9]{1,6})?"),
  },
  {
    code: "CSN409006",
    message: emptyValue("tipoCambio"),
  },
  {
    code: "CSN409007",
    message: valueIsNotNumber("tipoCambio"),
  },
];
export const errors_total = [
  {
    code: "CSN401101",
    message: undefinedValue("total"),
  },
  {
    code: "CSN401102",
    message: valueMustBe("total", ["string", "number"]),
  },
  {
    code: "CSN401103",
    message: emptyValue("total"),
  },
  {
    code: "CSN401104",
    message: "Si el tipo de comprobante es T, el total debe ser igual a 0 o cero con decimales.",
  },
  {
    code: "CSN401105",
    message: valueIsNotNumber("total"),
  },
];
export const errors_exportacion = [
  {
    code: "CSN401201",
    message: valueNotFoundInCatalog("exportacion", "c_Exportacion"),
  },
  {
    code: "CSN401202",
    message: valueMustBe("exportacion", ["string"]),
  },
  {
    code: "CSN401203",
    message: emptyValue("exportacion"),
  },
];
export const errors_moneda = [
  {
    code: "CSN401301",
    message: valueNotFoundInCatalog("moneda", "c_Moneda"),
  },
  {
    code: "CSN401302",
    message: valueMustBe("moneda", ["string"]),
  },
  {
    code: "CSN401303",
    message: emptyValue("moneda"),
  },
];
export const errors_lugar_expedicion = [
  {
    code: "CSN401401",
    message: valueNotFoundInCatalog("lugarExpedicion", "c_CodigoPostal"),
  },
  {
    code: "CSN401402",
    message: undefinedValue("lugarExpedicion"),
  },
  {
    code: "CSN401403",
    message: valueMustBe("lugarExpedicion", ["string", "number"]),
  },
  {
    code: "CSN401404",
    message: emptyValue("lugarExpedicion"),
  },
  {
    code: "CSN401405",
    message: valueNotMeetPattern("lugarExpedicion", "[0-9]{5}"),
  },
];
export const errors_periodicidad = [
  {
    code: "CSN401501",
    message: valueNotFoundInCatalog("periodicidad", "c_Periodicidad"),
  },
  {
    code: "CSN401502",
    message: valueMustBe("periodicidad", ["string"]),
  },
  {
    code: "CSN401503",
    message: emptyValue("periodicidad"),
  },
  {
    code: "CSN401504",
    message: undefinedValue("periodicidad"),
  },
];
export const errors_meses = [
  {
    code: "CSN401601",
    message: valueNotFoundInCatalog("meses", "c_Meses"),
  },
  {
    code: "CSN401602",
    message: valueMustBe("meses", ["string"]),
  },
  {
    code: "CSN401603",
    message: emptyValue("meses"),
  },
  {
    code: "CSN401604",
    message: undefinedValue("meses"),
  },
  {
    code: "CSN401605",
    message:
      'Si la propiedad "periodicidad" tiene el valor "05", la propiedad "meses" debe contener uno de los siguientes valores: "13", "14", "15", "16", "17" o "18".',
  },
  {
    code: "CSN401606",
    message:
      'Si la propiedad "periodicidad" tiene un valor distinto de "05", la propiedad "meses" debe contener uno de los siguientes valores: "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11" o "12".',
  },
];
export const errors_anio = [
  {
    code: "CSN401701",
    message: undefinedValue("anio"),
  },
  {
    code: "CSN401702",
    message: valueMustBe("anio", ["string", "number"]),
  },
  {
    code: "CSN401703",
    message: emptyValue("anio"),
  },
  {
    code: "CSN401704",
    message: 'El valor de la propiedad "anio" debe ser menor o igual al año vigente.',
  },
  {
    code: "CSN401705",
    message: valueIsNotNumber("anio"),
  },
  {
    code: "CSN401706",
    message: 'El valor de la propiedad "anio", no es igual al año en curso o no contiene un valor de hasta 5 ejercicios anteriores.',
  },
];
export const errors_tipo_relacion = [
  {
    code: "CSN401801",
    message: undefinedValue("tipoRelacion"),
  },
  {
    code: "CSN401802",
    message: valueMustBe("tipoRelacion", ["string"]),
  },
  {
    code: "CSN401803",
    message: emptyValue("tipoRelacion"),
  },
  {
    code: "CSN401804",
    message: valueNotFoundInCatalog("tipoRelacion", "c_TipoRelacion"),
  },
];
export const errors_uuids = [
  {
    code: "CSN401901",
    message: undefinedValue("uuids"),
  },
  {
    code: "CSN401902",
    message: 'La propiedad "uuids" debe ser un arreglo de cadenas de texto (string).',
  },
];
