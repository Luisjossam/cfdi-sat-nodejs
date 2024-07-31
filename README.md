# PAQUETE CFDI SAT PARA NODEJS

### Librería generadora de XML y creación de CFDI impreso, permite crear CFDI de tipo Ingreso, Egreso y Traslado, generar Carta Porte, Nominas, etc. Compatible con cualquier PAC.

#### Tabla de contenido

- [Instalación](#Instalación)
- [Importación](#Importación)
- [Factura de tipo ingreso](#Factura-de-tipo-ingreso)
  - [Método crearEmisor](#Método-crearEmisor)
  - [Método crearReceptor](#Método-crearReceptor)

### **Instalación**

```
npm install --save cfdi-sat-nodejs
```

### **Importación**

#### Para crear cualquier tipo de XML necesitas importar la librerÍa y una vez crear una nueva instancia.

```
const FacturaCFDI = require("cfdi-sat-nodejs");

const nuevaFactura = new FacturaCFDI();
```

### **Factura de tipo ingreso**

#### Aquí se te explica los diversos métodos para generar el XML y los requisitos que solicitan cada uno de estos métodos.

#### **Método crearEmisor**

```
nuevaFactura.crearEmisor(RFC, Nombre, RegimenFiscal)
```

se recibe 3 parámetros:

| Parámetro     | Tipo            | Descripción                                                                                 |
| ------------- | --------------- | ------------------------------------------------------------------------------------------- |
| RFC           | string          | RFC del emisor del comprobante.                                                             |
| Nombre        | string          | Correspondiente al nombre, denominación o razón social inscrito del emisor del comprobante. |
| RegimenFiscal | string - number | Clave vigente del regimen fiscal del emisor.                                                |

#### **Método crearReceptor**

```
nuevaFactura.crearReceptor(RFC, Nombre, RegimenFiscal, CodigoPostal, UsoCFDI)

/// EN CASO QUE EL RECEPTOR RESIDA EN OTRO PAÍS SE LLAMA AL MÉTODO receptorExtranjero:
nuevaFactura.receptorExtranjero(ResidenciaFiscal, NumRegIdTrib)
```

se recibe estos parámetros:

| Parámetro        | Tipo            | Descripción                                                                                      |
| ---------------- | --------------- | ------------------------------------------------------------------------------------------------ |
| RFC              | string          | RFC del receptor del comprobante.                                                                |
| Nombre           | string          | Nombre, denominación o razón social inscrito del receptor del comprobante.                       |
| RegimenFiscal    | string - number | Clave vigente del regimen fiscal del receptor.                                                   |
| CodigoPostal     | string - number | Código postal del domicilio fiscal del receptor del comprobante.                                 |
| UsoCFDI          | string          | Se debe registrar la clave que corresponda al uso que le dará al comprobante fiscal el receptor. |
| ResidenciaFiscal | string          | Clave del país de residencia para efectos fiscales del receptor del comprobante.                 |
| NumRegIdTrib     | string - number | Número de registro de identidad fiscal del receptor cuando este sea residente en el extranjero.  |
