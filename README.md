# PAQUETE CFDI SAT PARA NODEJS

## EN CONSTRUCCIÓN

Si la librería te ha servido, podrias hacermelo saber invitandome un café :)

[![Buy Me a Coffee](https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png)](https://buymeacoffee.com/luisjossam)

### Librería generadora de XML y creación de CFDI impreso, permite crear XML de tipo Ingreso, Egreso y Traslado, generar Carta Porte, Nominas, etc. Incluye catálogos en JSON.

### Tabla de contenido

- [Instalación](#Instalación)
- [Importación](#Importación)
- [XML de tipo ingreso](#XML-de-tipo-ingreso)
  - [Método crearEmisor](#Método-crearEmisor)
  - [Método crearReceptor](#Método-crearReceptor)
  - [Método certificado](#Método-certificado)
  - [Método esGlobal](#Método-esGlobal)
  - [Método crearConceptos](#Método-crearConceptos)
  - [Método crearSello](#Método-crearSello)
  - [Método generarXml](#Método-generarXml)
  - [Método generarXmlSellado](#Método-generarXmlSellado)
- [XML de tipo Egreso](#XML-de-tipo-Egreso)
  - [Nota de crédito](#Nota-de-crédito)
  - [Devolución](#Devolución)
- [XML de tipo Traslado](#XML-de-tipo-Traslado)
- [Carta Porte](#Carta-porte)
  - [Creando un nuevo complemento Carta Porte](#Creando-un-nuevo-complemento-Carta-Porte)
  - [Método crearRegimenesAduaneros](#Método-crearRegimenesAduaneros)
  - [Método crearUbicacionOrigen](#Método-crearUbicacionOrigen)
  - [Método crearUbicacionDestino](#Método-crearUbicacionDestino)
  - [Método crearMercancias](#Método-crearMercancias)
  - [Método crearMercancia](#Método-crearMercancia)
- [Catálogos](#Catálogos)

### **Instalación**

```javascript
npm install --save cfdi-sat-nodejs
```

### **Importación**

#### Para crear cualquier tipo de XML necesitas importar la librerÍa y una vez crear una nueva instancia.

```javascript
const { FacturaCFDI } = require("cfdi-sat-nodejs");

const nuevaFactura = new FacturaCFDI();
```

### **XML de tipo ingreso**

#### Aquí se te explica los diversos métodos para generar el XML y los requisitos que solicitan cada uno de estos métodos.

### **Método crearEmisor**

```javascript
nuevaFactura.crearEmisor(RFC, Nombre, RegimenFiscal);
```

se recibe 3 argumentos:

| Argumento     | Tipo            | Descripción                                                                                 |
| ------------- | --------------- | ------------------------------------------------------------------------------------------- |
| RFC           | string          | RFC del emisor del comprobante.                                                             |
| Nombre        | string          | Correspondiente al nombre, denominación o razón social inscrito del emisor del comprobante. |
| RegimenFiscal | string - number | Clave vigente del regimen fiscal del emisor.                                                |

### **Método crearReceptor**

```javascript
nuevaFactura.crearReceptor(RFC, Nombre, RegimenFiscal, CodigoPostal, UsoCFDI);
```

se recibe estos argumentos:

| Argumento        | Tipo            | Descripción                                                                                      |
| ---------------- | --------------- | ------------------------------------------------------------------------------------------------ |
| RFC              | string          | RFC del receptor del comprobante.                                                                |
| Nombre           | string          | Nombre, denominación o razón social inscrito del receptor del comprobante.                       |
| RegimenFiscal    | string - number | Clave vigente del regimen fiscal del receptor.                                                   |
| CodigoPostal     | string - number | Código postal del domicilio fiscal del receptor del comprobante.                                 |
| UsoCFDI          | string          | Se debe registrar la clave que corresponda al uso que le dará al comprobante fiscal el receptor. |
| ResidenciaFiscal | string          | Clave del país de residencia para efectos fiscales del receptor del comprobante.                 |
| NumRegIdTrib     | string - number | Número de registro de identidad fiscal del receptor cuando este sea residente en el extranjero.  |

### **Método certificado**

En este método debes cargar la ruta del certificado en su formato base sin convertir ya que la librería se encarga de ese proceso.

```javascript
nuevaFactura.certificado(PathCertificado);
```

se recibe este único argumento:

| Argumento       | Tipo   | Descripción                  |
| --------------- | ------ | ---------------------------- |
| PathCertificado | string | Ruta del certificado (.cer). |

### **Método esGlobal**

Si necesitas generar facturas globales, llama al método **esGlobal** con los parámetros correspondientes a la periodicidad, meses y año.

```javascript
nuevaFactura.esGlobal(Periocidad, Meses, Año);
```

| Argumento  | Tipo            | Descripción                                      |
| ---------- | --------------- | ------------------------------------------------ |
| Periocidad | string - number | Tipo de periodo del comprobante                  |
| Meses      | string - number | Meses que abarca los movimientos del comprobante |
| Año        | string - number | Año que abarca los movimientos del comprobante   |

### **Método crearConceptos**

```javascript
const array = [
  {
    ClaveProdServ: 1234567890, // obligatorio
    Cantidad: 1, // obligatorio
    ClaveUnidad: "H87", // obligatorio
    Unidad: "Pieza", // obligatorio
    Descripcion: "Producto", // obligatorio
    ValorUnitario: 125, // obligatorio
    Importe: 125, // obligatorio
    ObjetoImp: "02", // obligatorio
    NoIdentificacion: 567384983723, // opcional
    Descuento: 25, // opcional
    Impuesto: {
      Impuesto: "002", // obligatorio
      TipoFactor: "Tasa", // obligatorio
      TasaOCuota: "0.16", // obligatorio
    },
    /// EN CASO QUE EL PRODUCTO O SERVICIO APLIQUE RETENCIONES
    Retenciones: [
      {
        Impuesto: "001", // obligatorio
        TipoFactor: "Tasa", // obligatorio
        TasaOCuota: "0.10", // obligatorio
      },
    ],
  },
];

nuevaFactura.crearConceptos(array);
```

Es muy importante que en este método se envié la información acorde a lo requerido por la librería debido a que si los nombres de las propiedades son distintas a los esperados se retornara un error.

El método recibe un array como argumento, dentro debe contender los objetos correspondientes a los productos o servicios a facturar. Al ser el único método relacionado con los conceptos, es necesario incluir los datos del impuesto y retenciones (en caso de aplicar) dentro de cada objeto junto al resto de datos tal cual se muestran arriba.

NOTA: Si **ObjetoImp** es "01" no es necesario incluir el objeto Impuesto ni el array Retenciones.

| Argumento        | Tipo            | Descripción                                                                                               |
| ---------------- | --------------- | --------------------------------------------------------------------------------------------------------- |
| ClaveProdServ    | string - number | Clave que permita clasificar los conceptos del comprobante como productos o servicios.                    |
| Cantidad         | string - number | Cantidad de bienes o servicios que correspondan a cada concepto.                                          |
| ClaveUnidad      | string          | Clave unidad del producto o servicio.                                                                     |
| Unidad           | string          | Nombre de la unidad de medida correspondiente a la ClaveUnidad.                                           |
| Descripcion      | string          | Descripción del producto o servicio a facturar.                                                           |
| ValorUnitario    | string - number | Valor o precio unitario del producto o servicio.                                                          |
| Importe          | string - number | Importe total de producto o servicio, resultado de la multiplicación de la Cantidad por el ValorUnitario. |
| ObjetoImp        | string - number | Clave correspondiente para indicar si la operación es objeto o no de impuesto.                            |
| NoIdentificacion | string          | Identificador del producto o servicio, puede ser el código de barras, SKU o cualquier otro identificador. |
| Descuento        | number          | Valor a aplicar al importe. debe contener la misma cantidad de decimales que el importe.                  |

Estos argumentos aplican tanto para el objeto Impuesto como al array Retenciones

| Argumento  | Tipo            | Descripción                                          |
| ---------- | --------------- | ---------------------------------------------------- |
| Impuesto   | string - number | Tipo de impuesto aplicable.                          |
| TipoFactor | string          | Tipo de factor que se aplica a la base del impuesto. |
| TasaOCuota | string - number | Valor de la tasa o cuota del impuesto.               |

En caso de tener un **TipoFactor** como "Exento" puede omitir el valor de **TasaOCuota** ya que la librería no lo toma en cuenta.

### **Método crearSello**

En caso de querer generar un XMl ya sellado y listo para timbrar puede usar el siguiente método.

```javascript
nuevaFactura.crearSello(PathLlavePrivada, Contraseña);
```

NOTA: La llave privada debe de estar en su formato base no convertida ya que la librería se encarga de convertirla.

| Argumento        | Tipo   | Descripción                                         |
| ---------------- | ------ | --------------------------------------------------- |
| PathLlavePrivada | string | Ruta de la llave privada en su formato base (.key). |
| Contraseña       | string | Contraseña de la llave privada.                     |

### **Método generarXml**

```javascript
const atributos = [
    Serie: 'F',                       // opcional (valor por defecto "F")
    Folio: 1,                         // obligatorio
    Fecha: '2022-01-27T11:49:48',     // opcional (valor por defecto "Hora actual")
    FormaPago: '02',                  // obligatorio
    CondicionesDePago: '3 meses',     // opcional (valor por defecto "")
    TipoDeComprobante: 'I',           // opcional (valor por defecto "I")
    MetodoPago: 'PUE',                // obligatorio
    LugarExpedicion: '00000',         // obligatorio
    Subtotal: 4545,                   // obligatorio
    Total: 4545,                      // obligatorio
    Moneda: 'MXN',                    // opcional (valor por defecto "MXN")
    Exportacion: "01",                // opcional (valor por defecto "01")
    Descuento: 0                      // opcional (valor por defecto "0")
];

const xml = nuevaFactura.generarXml(atributos)
```

En este método nos retorna el XML sin sellar. en caso de requerir el XML sellado vea el siguiente método.

### **Método generarXmlSellado**

Para crear el XML sellado, es necesario que el método **generarXmlSellado** sea llamado de manera asincrónica. Esto se puede lograr utilizando _async/await_ o la cadena de promesas con _.then()_ y _.catch()_.

```javascript
const xmlSellado = await nuevaFactura.generarXmlSellado(atributos);

// Tambien puedes usar:

nuevaFactura
  .generarXmlSellado(atributos)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.log(error);
  });
```

Para generar el XML sellado es necesario incluir el método **crearSello** antes del método **generarXmlSellado** de lo contrario retorna un error.

| Argumento         | Tipo            | Descripción                                                                                              |
| ----------------- | --------------- | -------------------------------------------------------------------------------------------------------- |
| Serie             | string          | Prefijo o nombre de la serie de las facturas.                                                            |
| Folio             | string - number | Numero referente al movimiento.                                                                          |
| Fecha             | string          | Fecha actual en que se realiza el movimiento en formato AAAA-MM-DDThh:mm:ss                              |
| FormaPago         | string - number | Clave de la forma de pago de los bienes, la prestación de los servicios, el otorgamiento del uso o goce. |
| CondicionesDePago | string          | Condiciones comerciales aplicables para el pago del comprobante de tipo ingreso o egreso.                |
| TipoDeComprobante | string          | Clave con la que se identifica el tipo de comprobante fiscal.                                            |
| MetodoPago        | string - number | Clave que corresponda depende si se paga en una sola exhibición o en parcialidades.                      |
| LugarExpedicion   | string - number | Código postal del lugar de expedición del comprobante.                                                   |
| Subtotal          | string - number | Suma de los importes de los conceptos antes de descuentos e impuestos.                                   |
| Total             | string - number | Suma del subtotal, menos los descuentos, más impuestos trasladados menos los impuestos retenidos.        |
| Moneda            | string          | Clave de la moneda utilizada para expresar los montos.                                                   |
| Exportacion       | string - number | Clave con la que se identifica si el comprobante ampara una operación de exportación.                    |
| Descuento         | string - number | Importe total de los descuentos aplicables antes de impuestos.                                           |

## **XML de tipo Egreso**

### **Nota de crédito**

Para crear un XML de nota de crédito puede utilizar los métodos para la creación de un CFDI de tipo ingreso, los únicos que debe cambiar es el tipo de comprobante a Egreso ("E") y la serie.

EJEMPLO:

```javascript
const atributos = [
    Serie: 'NC',
    TipoDeComprobante: 'E'
    // el resto de valores
];
```

### **Devolución**

Para crear un XML de devolución puede utilizar los métodos para la creación de un CFDI de tipo ingreso, los únicos que debe cambiar es el tipo de comprobante a Egreso ("E") y la serie.

EJEMPLO:

```javascript
const atributos = [
    Serie: 'AC',
    TipoDeComprobante: 'E'
    // el resto de valores
];
```

## **XML de tipo Traslado**

Para crear un XML de tipo Traslado puede usar los metodos para la creacion de un CFDI de tipo ingreso, los únicos que debe cambiar es el tipo de comprobante a Traslado ("T"), la serie y los totales deben ser igual a "0" y los conceptos deben tener el Objeto de impuesto igual a "01".

EJEMPLO:

```javascript
const atributos = [
    Serie: 'Traslados',
    TipoDeComprobante: 'T'
    SubTotal: 0,
    Total: 0,
    // resto de valores
];

const conceptos = [
  {
    ObjetoImp: "01",
    // resto de valores
  }
];

```

## **Carta Porte**

Para poder generar el complemento Carta Porte es necesario contar con el XML de tipo ingreso o traslado sin timbrar e información relacionada a este complemento.

### **Creando un nuevo complemento Carta Porte**

```javascript
const { CartaPorte } = require("cfdi-sat-nodejs");

const pathXml = "ruta del XML sin timbrar.";
const nuevaCartaPorte = new CartaPorte(pathXml);
```

### **Método crearRegimenesAduaneros**

En caso que el traslado de bienes y/o servicios sea internacional puede usar el método **Método crearRegimenesAduaneros**

```javascript
const Array = ["valor1", "valor2", "valor3"];

nuevaCartaPorte.crearRegimenesAduaneros(Array);
```

| Argumento | Tipo  | Descripción                                                      |
| --------- | ----- | ---------------------------------------------------------------- |
| Array     | array | Claves de los regímenes aduaneros aplicables (máximo 10 claves). |

### **Método crearUbicacionOrigen**

Para la generación del complemento Carta Porte es necesario incluir datos de ubicación tanto de origen como de destino.
Con el método **crearUbicacionOrigen** puede definir la información necesaria para la ubicación de tipo "Origen"

```javascript
const data = {
  IDUbicacion: "OR000001", // Opcional
  RFCRemitenteDestinatario: "XIQB891116QE4", // Obligatorio
  NombreRemitenteDestinatario: "BERENICE XIMO QUEZADA", // Opcional
  FechaHoraSalidaLlegada: "2023-08-01T00:00:00", // Obligatorio
  Calle: "Domicilio", // Obligatorio
  NumeroExterior: 12, // Obligatorio
  NumeroInterior: 5, // Obligatorio
  Colonia: "0900", // Obligatorio
  Localidad: "06", // Obligatorio
  Referencia: "referencias", // Obligatorio
  Municipio: "015", // Obligatorio
  Estado: "CMX", // Obligatorio
  Pais: "MEX", // Obligatorio
  CodigoPostal: "06300", // Obligatorio
  // Opcional en caso de que el remitente sea extranjero y el RFC sea XEXX010101000
  NumRegIdTrib: "121585958",
  ResidenciaFiscal: "USA",
};

nuevaCartaPorte.crearUbicacionOrigen(data);
```

### **Método crearUbicacionDestino**

Al igual que el método **crearUbicacionOrigen** es necesario especificar los datos de destino, para esto puede usar el método **crearUbicacionDestino**

```javascript
const data = {
  IDUbicacion: "DE000001", // Opcional
  RFCRemitenteDestinatario: "XIQB891116QE4", // Obligatorio
  NombreRemitenteDestinatario: "BERENICE XIMO QUEZADA", // Opcional
  FechaHoraSalidaLlegada: "2023-08-01T00:00:00", // Obligatorio
  DistanciaRecorrida: 1548, // Obligatorio
  Calle: "Domicilio", // Obligatorio
  NumeroExterior: 12, // Obligatorio
  NumeroInterior: 5, // Obligatorio
  Colonia: "0900", // Obligatorio
  Localidad: "06", // Obligatorio
  Referencia: "referencias", // Obligatorio
  Municipio: "015", // Obligatorio
  Estado: "CMX", // Obligatorio
  Pais: "MEX", // Obligatorio
  CodigoPostal: "06300", // Obligatorio
  // Opcional en caso de que el remitente sea extranjero y el RFC sea XEXX010101000
  NumRegIdTrib: "121585958",
  ResidenciaFiscal: "USA",
};

nuevaCartaPorte.crearUbicacionDestino(data);
```

| Argumento                   | Tipo            | Descripción                                                                                                    |
| --------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------- |
| IDUbicacion                 | string          | Identificador en caso de tener diferentes ubicaciones de origen o destino. (OR para origen y DE para destino). |
| RFCRemitenteDestinatario    | string          | RFC del remitente o destinatario.                                                                              |
| NombreRemitenteDestinatario | string          | Nombre del remitente o destinatario correspondiente al RFC.                                                    |
| FechaHoraSalidaLlegada      | string          | Fecha estimada para registrar la hora de salida o llegada de los vienes en formato AAAA-MM-DDThh:mm:ss         |
| DistanciaRecorrida          | string - number | (Valor solo para el método crearUbicacionDestino) Distancia recorrida en kilómetros entre el origen y destino. |
| Calle                       | string          | Nombre de la calle del domicilio del remitente o destinatario.                                                 |
| NumeroExterior              | string - number | Número exterior del domicilio del remitente o destinatario.                                                    |
| NumeroInterior              | string - number | Número interior del domicilio del remitente o destinatario.                                                    |
| Colonia                     | string - number | Colonia del domicilio del remitente o destinatario.                                                            |
| Localidad                   | string - number | Localidad del domicilio del remitente o destinatario.                                                          |
| Referencia                  | string          | Referencias del domicilio del remitente o destinatario.                                                        |
| Municipio                   | string - number | Municipio del domicilio del remitente o destinatario.                                                          |
| Estado                      | string          | Estado perteneciente del remitente o destinatario.                                                             |
| Pais                        | string          | País del remitente o destinatario.                                                                             |
| CodigoPostal                | string - number | Código postal del domicilio del remitente o destinatario.                                                      |
| NumRegIdTrib                | string - number | Identificación fiscal del remitente o destinatario en caso de residentes extranjeros.                          |
| ResidenciaFiscal            | string          | País del remitente o destinatario en caso de residentes extranjeros.                                           |

### **Método crearMercancias**

```javascript
const mercancias = {
  PesoBrutoTotal: 6, // Obligatorio
  UnidadPeso: "KGM", // Obligatorio
  NumTotalMercancias: 1, // Obligatorio
  LogisticaInversaRecoleccionDevolucion: true, // Opcional
};

newCartaPorte.crearMercancias(mercancias);
```

| Argumento                             | Tipo            | Descripción                                                                                                        |
| ------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------ |
| PesoBrutoTotal                        | string - number | Suma de los pesos de los bienes y/o mercancías con un margen diferencial del 10%.                                  |
| UnidadPeso                            | string          | Clave de la unidad correspondiente al PesoBrutoTotal.                                                              |
| NumTotalMercancias                    | string - number | Número total de los bienes y/o mercancías que se trasladan.                                                        |
| LogisticaInversaRecoleccionDevolucion | boolean         | En caso de ser una operación de logística inversa o devolución y solo para autotransporte debe existir este valor. |

### **Método crearMercancia**

```javascript
const objetoMercancia = {
  BienesTransp: 24131510,
  Descripcion: "Refrigeradores de mostrador",
  Cantidad: 1,
  ClaveUnidad: "H87",
  Unidad: "Pieza",
  Dimensiones: "59/40/36cm",
  MaterialPeligroso: "No",
  PesoEnKg: 6,
  FraccionArancelaria: 8418699999,
  TipoMateria: "03",
  // En caso que TipoMateria sea "05" debe existe el siguiente valor
  DescripcionMateria: "DescripcionMateria",
  // En caso que sea un material peligroso es necesario agregar estos valores
  CveMaterialPeligroso: 3496,
  Embalaje: "4D",
  DescripEmbalaje: " Cajas de madera contrachapada.",
  // En caso que el registro sea parte del sector COFEPRIS incluir estos valores
  SectorCOFEPRIS: "01",
  NombreIngredienteActivo: "NombreIngredienteActivo",
  NomQuimico: "NomQuimico",
  DenominacionGenericaProd: "DenominacionGenericaProd",
  DenominacionDistintivaProd: "DenominacionDistintivaProd",
  Fabricante: "Fabricante",
  FechaCaducidad: "2003-04-02",
  LoteMedicamento: "LoteMedicamento",
  FormaFarmaceutica: "FormaFarmaceutica",
  CondicionesEspTransp: "CondicionesEspTransp",
  RegistroSanitarioFolioAutorizacion: "RegistroSanitarioFolioAutorizacion",
  PermisoImportacion: "PermisoImportacion",
  FolioImpoVUCEM: "FolioImpoVUCEM",
  NumCAS: "NumCAS",
  RazonSocialEmpImp: "RazonSocialEmpImp",
  NumRegSanPlagCOFEPRIS: "NumRegSanPlagCOFEPRIS",
  DatosFabricante: "DatosFabricante",
  DatosFormulador: "DatosFormulador",
  DatosMaquilador: "DatosMaquilador",
  UsoAutorizado: "UsoAutorizado",
};

newCartaPorte.crearMercancias(objetoMercancia);
```

## **Catálogos**

La librería cuenta con todos los catálogos proporcionados por el SAT actualizados, todos en formato JSON. Se proporciona un método para obtener todo el contenido de cada catalogo asi como un método para obtener específicamente un registro de un catálogo en especifico.

A continuación se colocan todos los métodos disponibles

```javascript
/// Importar la clase y crear una nueva instancia
const { CatalogosSAT } = require("cfdi-sat-nodejs");
const catalogos = new CatalogosSAT();
```

```javascript
/// Obtener un solo registro de un catálogo
catalogos.buscarEnCatalogo(Valor, Clave, NombreCatalogo);

/// Ejemplo de salida correcta
/*
{
  status: true,
  data: {
    clave: 'G01',
    descripcion: 'Adquisición de mercancías.',
    fisica: 'Sí',
    moral: 'Sí',
    regimen_receptor: '601, 603, 606, 612, 620, 621, 622, 623, 624, 625,626'
  }
}
*/

/// Ejemplo de salida errónea
/*
{ 
  status: false,
  data: null,
  message: 'Clave "G001" no encontrada en el catálogo "UsoCfdi"'
}
*/
```

| Argumento      | Tipo   | Descripción                       |
| -------------- | ------ | --------------------------------- |
| Valor          | string | Valor a buscar en el catalogo     |
| Clave          | string | Clave para filtrar en el catalogo |
| NombreCatalogo | string | Nombre del catálogo               |

```javascript
/// Obtener todos los registros de cada catálogo
catalogos.obtenerCatalogo(NombreCatalogo);

/// Ejemplo de salida correcta
/*
{
  status: true,
  data: [
    {
      clave: 'G01',
      descripcion: 'Adquisición de mercancías.',
      fisica: 'Sí',
      moral: 'Sí',
      regimen_receptor: '601, 603, 606, 612, 620, 621, 622, 623, 624, 625,626'
    },
    {
      clave: 'G02',
      descripcion: 'Devoluciones, descuentos o bonificaciones.',
      fisica: 'Sí',
      moral: 'Sí',
      regimen_receptor: '601, 603, 606, 612, 620, 621, 622, 623, 624, 625,626'
    },
    ...
  ]
}
*/

/// Ejemplo de salida errónea
/*
{ 
  status: false,
  data: null,
  message: 'El catálogo "usocfdi" no existe'
}
*/
```

| Argumento      | Tipo   | Descripción         |
| -------------- | ------ | ------------------- |
| NombreCatalogo | string | Nombre del catálogo |

**LISTA DE CATALOGOS DISPONIBLES**

- FormaPago
- Moneda
- TipoDeComprobante
- Exportacion
- MetodoPago
- CodigoPostalParteUno
- CodigoPostalParteDos
- Periodicidad
- Meses
- TipoRelacion
- RegimenFiscal
- Pais
- UsoCfdi
- ClaveProdServ
- ClaveUnidad
- ObjetoImpuesto
- Impuesto
- TipoFactor
- TasaOCuota
- Aduana
- NumPedimentoAduana
- PatenteAduanal
- ColoniaParteUno
- ColoniaParteDos
- ColoniaParteTres
- Estado
- Localidad
- Municipio
- RegimenAduanero
- ClaveTransporte
- TipoEstacion
- Estaciones
- ClaveUnidadPeso
- ClaveProdServCp
- MaterialPeligroso
- TipoEmbalaje
- TipoPermiso
- SectorCofepris
- FormaFarmaceutica
- CondicionesEspeciales
- TipoMateria
- DocumentoAduanero
- ParteTransporte
- FiguraTransporte
- ConfigAutotransporte
- SubtipoRemolque
- RegistroIstmo
- ConfigMaritima
- ClaveTipoCarga
- ContenedorMaritimo
- NumAutorizacionNaviero
- CodigoTransporteAereo
- TipoDeServicio
- DerechosDePaso
- TipoCarro
- Contenedor
- TipoTrafico
