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
  - [Método crearDocumentacionAduanera](#Método-crearDocumentacionAduanera)
  - [Método crearCantidadTransporta](#Método-crearCantidadTransporta)
  - [Método crearAutotransporte](#Método-crearAutotransporte)
  - [Método crearIdentificacionVehicular](#Método-crearIdentificacionVehicular)
  - [Método crearSeguros](#Método-crearSeguros)
  - [Método crearRemolques](#Método-crearRemolques)
  - [Método crearTipoFigura](#Método-crearTipoFigura)
  - [Método crearPartesTransporte](#Método-crearPartesTransporte)
  - [Método crearDomicilioTipoFigura](#Método-crearDomicilioTipoFigura)
  - [Método crearSello](#Método-crearSello)
  - [Método generarCartaPorte](#Método-generarCartaPorte)
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

SOBRE CARTA PORTE:

- En caso de generar un XML con complemento Carta Porte es necesario que el método **crearSello** sea de la clase "CartaPorte".
  [Vea mas sobre CartaPorte](#Carta-porte)

- Este método debe estar antes del [Método generarCartaPorte](#Método-generarCartaPorte)

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

SOBRE CARTA PORTE:

- Si pretende generar un XML con complemento CartaPorte se recomienda usar el método **generarXml** en lugar del método **generarXmlSellado**

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

const xml = "contenido del XML sin timbrar.";
const nuevaCartaPorte = new CartaPorte(xml);
```

NOTA: Aunque se admite un XML previamente sellado sin timbrar, se recomienda usa el XML sin sellar, esto para evitar tener que usar dos veces el método [**crearSello**](#método-crearsello)

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
  BienesTransp: 24131510, // Obligatorio
  Descripcion: "Refrigeradores de mostrador", // Obligatorio
  Cantidad: 1, // Obligatorio
  ClaveUnidad: "H87", // Obligatorio
  Unidad: "Pieza", // Obligatorio
  Dimensiones: "59/40/36cm", // Obligatorio
  MaterialPeligroso: "No", // Obligatorio
  PesoEnKg: 6, // Obligatorio
  FraccionArancelaria: 8418699999, // Obligatorio
  TipoMateria: "03", // Obligatorio
  // En caso que TipoMateria sea "05" debe existe la siguiente propiedad
  DescripcionMateria: "DescripcionMateria",
  // En caso que sea un material peligroso es necesario agregar estas propiedades
  CveMaterialPeligroso: 3496,
  Embalaje: "4D",
  DescripEmbalaje: " Cajas de madera contrachapada.",
  // En caso que el registro sea parte del sector COFEPRIS incluir estas propiedades
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

newCartaPorte.crearMercancia(objetoMercancia);
```

### **Método crearDocumentacionAduanera**

```javascript
const docAduanera = {
  TipoDocumento: "01", // Obligatorio
  // En caso que EntradaSalidaMerc sea diferente a "Entrada" y TipoDocumento sea distinto a "01" se debe omitir las siguientes propiedades
  NumPedimento: "10 47 3807 8003832",
  RFCImpo: "XEXX010101000",
};

// Puede encadenar el método crearDocumentacionAduanera a crearMercancia o simplemente usarlo por separado.
newCartaPorte
  .crearMercancia(objetoMercancia)
  .crearDocumentacionAduanera(docAduanera);
```

| Argumento     | Tipo            | Descripción                                                                                      |
| ------------- | --------------- | ------------------------------------------------------------------------------------------------ |
| TipoDocumento | string - number | Clave del tipo de documento aduanero.                                                            |
| NumPedimento  | string          | Número de pedimento correspondiente a la importación de los bienes y/o mercancías.               |
| RFCImpo       | string          | RFC del importador de los bienes y/o mercancías que fue registrado en la documentación aduanera. |

### **Método crearCantidadTransporta**

```javascript
const cantTransporta = {
  Cantidad: 2, // Obligatorio
  IDOrigen: "OR000001", // Obligatorio
  IDDestino: "DE000001", // Obligatorio
  CvesTransporte: "01", // Opcional en caso de ser Autotransporte
};

// Puede encadenar el método crearCantidadTransporta a crearMercancia o simplemente usarlo por separado.
newCartaPorte
  .crearMercancia(objetoMercancia)
  .crearCantidadTransporta(cantTransporta);
```

| Argumento      | Tipo            | Descripción                                                            |
| -------------- | --------------- | ---------------------------------------------------------------------- |
| Cantidad       | string - number | Número de los bienes y/o mercancías que se trasladan.                  |
| IDOrigen       | string          | Valor registrado del campo IDUbicacion del TipoUbicacion "Origen".     |
| IDDestino      | string          | Valor registrado del campo IDUbicacion del TipoUbicacion "Destino".    |
| CvesTransporte | string - number | Medio de transporte por el que se trasladan los bienes y/o mercancías. |

A partir de este punto los siguientes métodos seran enfocados a los distintos tipos de transporte.

### **Método crearAutotransporte**

```javascript
const autotransporte = {
  PermSCT: "TPAF01", // Obligatorio
  NumPermisoSCT: "0X2XTXZ0X5X0X3X2X1X0", // Obligatorio
};

newCartaPorte.crearAutotransporte(autotransporte);
```

| Argumento     | Tipo   | Descripción                                                                                                                  |
| ------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| PermSCT       | string | Permiso otorgado por la Secretaría de Infraestructura, Comunicaciones y Transportes (SICT) o la autoridad análoga.           |
| NumPermisoSCT | string | Número de permiso otorgado por la Secretaría de Infraestructura, Comunicaciones y Transportes (SICT) o la autoridad análoga. |

CITA: _Cuando no se cuente con un permiso emitido por parte de la Secretaría de Infraestructura, Comunicaciones y Transportes (SICT), debido a que no es requerido y se cuenta con un permiso de ámbito local o estatal, se debe registrar la clave TPXX00 en el campo Permiso SICT (PermSCT), registrando el número de permiso local o estatal en el campo Número de Permiso SICT (NumPermisoSCT). En caso de no requerir permiso se debe registrar la descripción Permiso no contemplado en el catálogo_

### **Método crearIdentificacionVehicular**

```javascript
const identificacionVehicular = {
  ConfigVehicular: "C2R2", // Obligatorio
  PesoBrutoVehicular: 35.5, // Obligatorio
  PlacaVM: "5031&&", // Obligatorio
  AnioModeloVM: 2000, // Obligatorio
};

newCartaPorte
  .crearAutotransporte(autotransporte)
  .crearIdentificacionVehicular(identificacionVehicular); // Método
```

| Argumento          | Tipo            | Descripción                                                                                         |
| ------------------ | --------------- | --------------------------------------------------------------------------------------------------- |
| ConfigVehicular    | string          | Clave asignada al tipo de transporte en el que se realiza el traslado de los bienes y/o mercancías. |
| PesoBrutoVehicular | string - number | Suma del peso vehicular y el peso de la carga.                                                      |
| PlacaVM            | string          | Placa del vehículo en el que se realiza el traslado de bienes y/o mercancías.                       |
| AnioModeloVM       | string - number | Año del vehículo en el que se realiza el traslado de bienes y/o mercancías.                         |

### **Método crearSeguros**

```javascript
const seguros = {
  AseguraRespCivil: "PFG& Seguros S.A. de C.V.", // Obligatorio
  PolizaRespCivil: 154647, // Obligatorio
  AseguraCarga: "PFG& Seguros S.A. de C.V.", // Opcional
  PolizaCarga: 368549, // Opcional
  PrimaSeguro: 1200, // Opcional
  // EN CASO DE TRANSPORTAR MATERIAL PELIGROSO DEBE PROPORCIONAR LOS DATOS DE ESTAS PROPIEDADES
  AseguraMedAmbiente: "Olimpo S.A. de C.V",
  PolizaMedAmbiente: 987423,
};

newCartaPorte
  .crearAutotransporte(autotransporte)
  .crearIdentificacionVehicular(identificacionVehicular)
  .crearSeguros(seguros); // Método
```

CANTIDAD DE VECES QUE PUEDE SER LLAMADO EL MÉTODO: Ilimitado

| Argumento          | Tipo            | Descripción                                                                                                                                                              |
| ------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AseguraRespCivil   | string          | nombre de la aseguradora que cubre los riesgos de responsabilidad civil del autotransporte.                                                                              |
| PolizaRespCivil    | string - number | Número de la póliza de seguro que emite la aseguradora que cubre los riesgos de responsabilidad civil del autotransporte.                                                |
| AseguraCarga       | string          | Nombre de la aseguradora que cubre los riesgos de la carga (bienes y/o mercancías) transportada.                                                                         |
| PolizaCarga        | string - number | Número de póliza que emite la aseguradora que cubre los riesgos de la carga (bienes y/o mercancías) transportada.                                                        |
| PrimaSeguro        | string - number | Valor del importe de la prima del seguro contratado.                                                                                                                     |
| AseguraMedAmbiente | string          | Nombre de la aseguradora que cubre los posibles daños al medio ambiente, aplicable para los transportistas que realicen el traslado de materiales o residuos peligrosos. |
| PolizaMedAmbiente  | string - number | Número de póliza asignado por la aseguradora, que cubre los posibles daños al medio ambiente.                                                                            |

### **Método crearRemolques**

```javascript
const remolques = {
  SubTipoRem: "CTR004",
  Placa: "5031&&",
};

newCartaPorte
  .crearAutotransporte(autotransporte)
  .crearIdentificacionVehicular(identificacionVehicular)
  .crearSeguros(seguros)
  .crearRemolques(remolques); // Método
```

CANTIDAD DE VECES QUE PUEDE SER LLAMADO EL MÉTODO: Ilimitado

| Argumento  | Tipo   | Descripción                                                                                   |
| ---------- | ------ | --------------------------------------------------------------------------------------------- |
| SubTipoRem | string | Clave del subtipo de remolque o semirremolque.                                                |
| Placa      | string | Placa del remolque o semirremolque en el que se realiza el traslado de bienes y/o mercancías. |

### **Método crearTipoFigura**

```javascript
const tipoFigura = {
  TipoFigura: "01", // Obligatorio
  NombreFigura: "Pancracio Chug Wan", // Obligatorio
  RFCFigura: "XXXX78041FXXX", // Opcional
  // En caso que el TipoFigura sea "01" debe proporcionar este dato
  NumLicencia: "000004",
  // En caso que el TipoFigura sea extranjero debe proporcionar estos datos
  NumRegIdTribFigura: 121585958,
  ResidenciaFiscalFigura: "USA",
};

newCartaPorte.crearTipoFigura(tipoFigura);
```

CANTIDAD DE VECES QUE PUEDE SER LLAMADO EL MÉTODO: Ilimitado

| Argumento              | Tipo            | Descripción                                                                                                                        |
| ---------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| TipoFigura             | string          | Clave de la figura quien hace el traslado de bienes y/o mercancías.                                                                |
| NombreFigura           | string          | Nombre de la figura de transporte que interviene en el traslado de los bienes y/o mercancías.                                      |
| RFCFigura              | string          | RFC de la figura de transporte que interviene en el traslado de los bienes y/o mercancías.                                         |
| NumLicencia            | string - number | Número de la licencia de conducir o permiso otorgado al operador de la unidad que se realiza el traslado de bienes y/o mercancías. |
| NumRegIdTribFigura     | string - number | Número de identificación fiscal que corresponde al tipo de la figura de transporte.                                                |
| ResidenciaFiscalFigura | string          | Clave del país que corresponde al tipo de figura de transporte                                                                     |

### **Método crearPartesTransporte**

```javascript
const partesTransporte = {
  ParteTransporte: "PT01", // Obligatorio
};

newCartaPorte
  .crearTipoFigura(tipoFigura)
  .crearPartesTransporte(partesTransporte); // Método
```

CANTIDAD DE VECES QUE PUEDE SER LLAMADO EL MÉTODO: Ilimitado

| Argumento       | Tipo   | Descripción                                                                                                |
| --------------- | ------ | ---------------------------------------------------------------------------------------------------------- |
| ParteTransporte | string | Clave que pertenece al transporte o la parte de transporte que no es propiedad del emisor del comprobante. |

### **Método crearDomicilioTipoFigura**

```javascript
const domicilioTipoFigura = {
  Calle: "Avenida Reforma Norte", // Opcional
  NumeroExterior: 77, // Opcional
  NumeroInterior: 5, // Opcional
  Colonia: "Zona Hotelera Norte", // Opcional
  Localidad: "California", // Opcional
  Municipio: "San Francisco", // Opcional
  Estado: "CA", // Obligatorio
  Pais: "USA", // Obligatorio
  CodigoPostal: 49109, // Obligatorio
  Referencia: "Frente al parque de Santa Úrsula.", // Opcional
};

newCartaPorte
  .crearTipoFigura(tipoFigura)
  .crearPartesTransporte(partesTransporte)
  .crearDomicilioTipoFigura(domicilioTipoFigura); // Método
```

CANTIDAD DE VECES QUE PUEDE SER LLAMADO EL MÉTODO: 1

| Argumento      | Tipo            | Descripción                                                                                                              |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Calle          | string          | Calle en la que está ubicado el domicilio de la figura de transporte.                                                    |
| NumeroExterior | string - number | Número exterior en donde se ubica el domicilio de la figura de transporte.                                               |
| NumeroInterior | string - number | Número interior en donde se ubica el domicilio de la figura de transporte.                                               |
| Colonia        | string          | Colonia en donde se ubica el domicilio de la figura de transporte.                                                       |
| Localidad      | string          | Localidad que corresponda a la ciudad o población en donde se encuentra ubicado el domicilio de la figura de transporte. |
| Municipio      | string          | Municipio, demarcación territorial o condado en donde se encuentra ubicado el domicilio de la figura de transporte.      |
| Estado         | string          | Estado, entidad, región, comunidad, en donde se encuentra ubicado el domicilio de la figura de transporte.               |
| Pais           | string          | Clave del país en donde se encuentra ubicado el domicilio de la Figura de transporte.                                    |
| CodigoPostal   | string . number | Clave del código postal en donde se encuentra el domicilio de la figura del transporte.                                  |
| Referencia     | string          | Referencia geográfica adicional, que permita una fácil o precisa ubicación del domicilio de la figura del transporte.    |

### **Método generarCartaPorte**

```javascript
const atributos = {
  TranspInternac: false, // Obligatorio
  TotalDistRec: 1, // Obligatorio
  // En caso que el traslado sea internacional debe proporcionar estos datos
  EntradaSalidaMerc: "Entrada",
  PaisOrigenDestino: "MEX",
  ViaEntradaSalida: "01",
  // Para el traslado de bienes y/o mercancias dentro de los polos de desarrollo para el bienestar del Istmo de Tehuantepec
  RegistroISTMO: true,
  UbicacionPoloOrigen: "01",
  UbicacionPoloDestino: "05",
};

await newCartaPorte.generarCartaPorte(atributos);

// ó

newCartaPorte.generarCartaPorte(atributos).then((res) => {
  console.log(res);
});
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
