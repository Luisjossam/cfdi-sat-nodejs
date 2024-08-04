# PAQUETE CFDI SAT PARA NODEJS

Si la librería te ha servido, podrias hacermelo saber invitandome un café :)

[![Buy Me a Coffee](https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png)](https://buymeacoffee.com/luisjossam)

### Librería generadora de XML y creación de CFDI impreso, permite crear CFDI de tipo Ingreso, Egreso y Traslado, generar Carta Porte, Nominas, etc. Compatible con cualquier PAC.

### Tabla de contenido

- [Instalación](#Instalación)
- [Importación](#Importación)
- [Factura de tipo ingreso](#Factura-de-tipo-ingreso)
  - [Método crearEmisor](#Método-crearEmisor)
  - [Método crearReceptor](#Método-crearReceptor)
  - [Método certificado](#Método-certificado)
  - [Método esGlobal](#Método-esGlobal)
  - [Método crearConceptos](#Método-crearConceptos)
  - [Método generarXml](#Método-generarXml)
  - [Método generarXmlSellado](#Método-generarXmlSellado)
- [Factura de tipo Egreso](#Factura-de-tipo-Egreso)
  - [Nota de crédito](#Nota-de-crédito)
    - [Método crearEmisor](#Método-crearEmisor)
    - [Método crearReceptor](#Método-crearReceptor)
    - [Método crearCFDIRelacionados](#Método-crearCFDIRelacionados)
    - [Método crearConceptos](#Método-crearConceptos)
    - [Método generarXml](#Método-generarXml)
    - [Método generarXmlSellado](#Método-generarXmlSellado)
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

### **Factura de tipo ingreso**

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

/// EN CASO QUE EL RECEPTOR RESIDA EN OTRO PAÍS SE LLAMA AL MÉTODO receptorExtranjero:
nuevaFactura.receptorExtranjero(ResidenciaFiscal, NumRegIdTrib);
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

En este método debes cargar la ruta del certificado en su formato base sin convertir en .pem ya que la librería se encarga de ese proceso.

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

NOTA: La llave privada debe de estar en su formato base no convertida en .pem ya que la librería se encarga de convertirla.

| Argumento        | Tipo   | Descripción                                         |
| ---------------- | ------ | --------------------------------------------------- |
| PathLlavePrivada | string | Ruta de la llave privada en su formato base (.key). |
| Contraseña       | string | Contraseña de la llave privada.                     |

### **Método generarXml**

```javascript
const atributos = [
    Folio: 1,            // obligatorio
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

## **Factura de tipo Egreso**

### **Nota de crédito**

## **Catálogos**

La librería cuenta con todos los catálogos proporcionados por el SAT actualizados, todos en formato JSON.
Se proporciona un método para obtener todo el contenido de cada catalogo asi como un método para obtener específicamente un registro de un catálogo en especifico.

A continuación se colocan todos los métodos disponibles

```javascript
/// Importar la clase y crear una nueva instancia
const { CatalogosSAT } = require("cfdi-sat-nodejs");
const catalogos = new CatalogosSAT();
```

```javascript
/// Obtener un solo registro de un catálogo
catalogos.buscarEnCatalogo(Clave, NombreCatalogo);
```

| Argumento      | Tipo   | Descripción                       |
| -------------- | ------ | --------------------------------- |
| Clave          | string | Valor para filtrar en el catalogo |
| NombreCatalogo | string | Nombre del catálogo               |

```javascript
/// Obtener todos los registros de cada catálogo
catalogos.obtenerCatalogo(NombreCatalogo);
```

| Argumento      | Tipo   | Descripción         |
| -------------- | ------ | ------------------- |
| NombreCatalogo | string | Nombre del catálogo |

**LISTA DE CATALOGOS DISPONIBLES**

- FormaPago
- Monedas
- TipoDeComprobante
- Exportacion
- MetodoPago
- CodigoPostalParte1
- CodigoPostalParte2
- CodigoPostalParte3
- CodigoPostalParte4
- Periodicidad
- Meses
- TipoRelacion
- RegimenFiscal
- Pais
- UsoCFDI
- ClaveProdServ
- ClaveUnidad
- ObjetoImpuesto
- Impuesto
- TipoFactor
- TasaOCuota
- Aduana
- NumPedimentoAduana
- PatenteAduanal
- ColoniaParte1
- ColoniaParte2
- ColoniaParte3
- Estado
- Localidad
- Municipio
