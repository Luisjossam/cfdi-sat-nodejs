export const errors_tipo_comprobante = [
  {
    code: "CSN40106",
    message: 'El tipo de la propiedad "tipoDeComprobante" no es valido. Debe ser de tipo string.',
  },
  {
    code: "CSN40107",
    message: "El campo tipoDeComprobante, no contiene un valor del catálogo c_TipoDeComprobante.",
  },
];
export const errors_serie = [
  {
    code: "CSN40108",
    message: 'No existe la propiedad "serie".',
  },
  {
    code: "CSN40109",
    message: 'El tipo de la propiedad "serie" no es valido. Debe ser de tipo string.',
  },
  {
    code: "CSN40110",
    message: 'La propiedad "serie" no puede estar vacío.',
  },
];
export const errors_folio = [
  {
    code: "CSN40111",
    message: 'No existe la propiedad "folio".',
  },
  {
    code: "CSN40112",
    message: 'El tipo de la propiedad "folio" no es valido. Debe ser de tipo string.',
  },
  {
    code: "CSN40113",
    message: 'La propiedad "folio" no puede estar vacío.',
  },
];
export const errors_fecha = [
  {
    code: "CSN40114",
    message: "El campo fecha no cumple con el patrón requerido. Debe seguir el formato YYYY-MM-DDTHH:mm:ss",
  },
  {
    code: "CSN40115",
    message: 'No existe la propiedad "fecha".',
  },
  {
    code: "CSN40116",
    message: 'El tipo de la propiedad "fecha" no es valido. Debe ser de tipo string.',
  },
  {
    code: "CSN40117",
    message: "La fecha ingresada es superior a la fecha y hora actual.",
  },
  {
    code: "CSN40118",
    message: "La fecha no pertenece al mes vigente.",
  },
];
export const errors_forma_pago = [
  {
    code: "CSN40119",
    message: "Si existe el tipo de comprobante T, N o P, la propiedad formaPago no debe existir.",
  },
  {
    code: "CSN40120",
    message: "El campo FormaPago no contiene un valor del catálogo c_FormaPago.",
  },
  {
    code: "CSN40121",
    message:
      'La propiedad formaPago no contiene el valor "99". Esta propiedad debe contener el valor “99” cuando la propiedad metodoPago contenga el valor “PPD”.',
  },
  {
    code: "CSN40122",
    message: 'No existe la propiedad "formaPago".',
  },
  {
    code: "CSN40123",
    message: 'El tipo de la propiedad "formaPago" no es valido. Debe ser de tipo string o number.',
  },
  {
    code: "CSN40124",
    message: 'La propiedad "formaPago" no puede estar vacío.',
  },
];
export const errors_metodo_pago = [
  {
    code: "CSN40125",
    message: 'No existe la propiedad "metodoPago".',
  },
  {
    code: "CSN40126",
    message: 'El tipo de la propiedad "metodoPago" no es valido. Debe ser de tipo string.',
  },
  {
    code: "CSN40127",
    message: 'La propiedad "metodoPago" no puede estar vacío.',
  },
  {
    code: "CSN40128",
    message: 'La propiedad "metodoPago", no contiene un valor del catálogo c_MetodoPago.',
  },
  {
    code: "CSN40129",
    message: 'Si existe el tipo de comprobante P o T, la propiedad "metodoPago" no debe existir.',
  },
];
export const errors_subtotal = [
  {
    code: "CSN40130",
    message: 'No existe la propiedad "subtotal".',
  },
  {
    code: "CSN40131",
    message: 'El tipo de la propiedad "subtotal" no es valido. Debe ser de tipo string o number.',
  },
  {
    code: "CSN40132",
    message: 'La propiedad "subtotal" no puede estar vacía.',
  },
  {
    code: "CSN40133",
    message: "Si el tipo de comprobante es T o P, el subtotal debe ser igual a 0 o cero con decimales.",
  },
];
