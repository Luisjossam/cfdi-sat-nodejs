# PAQUETE CFDI SAT PARA NODEJS

### Librería generadora de XML y creación de cfdi impreso, permite crear CFDI de tipo Ingreso, Egreso y Traslado, generar Carta Porte, Nominas, etc.

#### Tabla de contenido

- [Instalación](#Instalación)
- [Importación](#Importación)
- [Factura de tipo ingreso](#Factura-de-tipo-ingreso)
  - [Método crearEmisor](#Método-crearEmisor)

### **Instalación**

```npm install --save cfdi-sat-nodejs

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
    nuevaFactura.crearEmisor(rfc, nombre, regimenFiscal)

```

#### se recibe 3 parámetros:

#### RFC (string): RFC del emisor del comprobante.

#### Nombre (string): correspondiente al nombre, denominación o razón social inscrito del emisor del comprobante.

#### regimenFiscal (string | number): Clave vigente del regimen fiscal del emisor.
