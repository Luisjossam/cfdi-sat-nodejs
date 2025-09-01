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
    code: "CFDI40104",
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
export const errors_descuento = [
  {
    code: "CSN40134",
    message: 'El tipo de la propiedad "descuento" no es valido. Debe ser de tipo string o number.',
  },
  {
    code: "CSN40135",
    message: 'La propiedad "descuento" no puede ser un valor negativo.',
  },
  {
    code: "CSN40136",
    message: 'Si el tipo de comprobante es T o P, la propiedad "descuento" no debe existir.',
  },
  {
    code: "CSN40137",
    message: "El valor del descuento debe ser menor o igual que el valor de la propiedad subtotal.",
  },
];
export const errors_tipo_cambio = [
  {
    code: "CSN40138",
    message: 'El tipo de la propiedad "tipoCambio" no es valido. Debe ser de tipo string o number.',
  },
  {
    code: "CSN40139",
    message: 'La propiedad "tipoCambio" se debe registrar cuando la propiedad "moneda" tiene un valor distinto de MXN y XXX.',
  },
  {
    code: "CSN40140",
    message: 'La propiedad "tipoCambio" existe y no tiene el valor "1" cuando la moneda indicada o predeterminada es MXN.',
  },
  {
    code: "CSN40141",
    message: 'La propiedad "tipoCambio" no se debe registrar cuando la propiedad "moneda" tiene el valor XXX.',
  },
  {
    code: "CSN40142",
    message: 'La propiedad "tipoCambio" no cumple con el patrón requerido: [0-9]{1,18}(.[0-9]{1,6})?',
  },
  {
    code: "CSN40143",
    message: 'La propiedad "tipoCambio" no puede estar vacía.',
  },
];
export const errors_total = [
  {
    code: "CSN40144",
    message: 'No existe la propiedad "total".',
  },
  {
    code: "CSN40145",
    message: 'El tipo de la propiedad "total" no es valido. Debe ser de tipo string o number.',
  },
  {
    code: "CSN40146",
    message: 'La propiedad "total" no puede estar vacía.',
  },
  {
    code: "CSN40147",
    message: "Si el tipo de comprobante es T, el total debe ser igual a 0 o cero con decimales.",
  },
];
export const errors_exportacion = [
  {
    code: "CFDI40123",
    message: "El campo Exportacion no contiene un valor del catálogo c_Exportacion.",
  },
  {
    code: "CSN40148",
    message: 'El tipo de la propiedad "exportacion" no es valido. Debe ser de tipo string.',
  },
  {
    code: "CSN40149",
    message: 'La propiedad "exportacion" no puede estar vacía.',
  },
];
export const errors_moneda = [
  {
    code: "CFDI40113",
    message: "El campo Moneda no contiene un valor del catálogo c_Moneda.",
  },
  {
    code: "CSN40150",
    message: 'El tipo de la propiedad "moneda" no es valido. Debe ser de tipo string.',
  },
  {
    code: "CSN40151",
    message: 'La propiedad "moneda" no puede estar vacía.',
  },
];
export const errors_lugar_expedicion = [
  {
    code: "CFDI40126",
    message: "El campo LugarExpedicion, no contiene un valor del catálogo c_CodigoPostal.",
  },
  {
    code: "CSN40152",
    message: 'No existe la propiedad "lugarExpedicion".',
  },
  {
    code: "CSN40153",
    message: 'El tipo de la propiedad "lugarExpedicion" no es valido. Debe ser de tipo string o number.',
  },
  {
    code: "CSN40154",
    message: 'La propiedad "lugarExpedicion" no puede estar vacía.',
  },
  {
    code: "CSN40155",
    message: 'La propiedad "lugarExpedicion" no cumple con el patrón requerido: [0-9]{5}.',
  },
];
