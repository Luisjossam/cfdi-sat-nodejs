# Changelog

Todas las modificaciones realizadas se documentan aquí.

## [v3.1.0] - 2025-07-11

### Cambios importantes

- La subpropiedad `unidad` dentro de la propiedad `concepto` en el método `createNodeConcepto` de la clase `FacturaCfdi` ahora es opcional.

### Nuevas caracteristicas

- Soporte para Complemento de Pagos 2.0.
- Las clases `FacturaCfdi`, `CartaPorte` ahora también generan el CFDI en JSON, con opción a formato simplificado.
- Clase `FacturaCfdi` ahora acepta el tipo `P` (**Pagos**) en `TipoDeComprobante`.
- Nueva documentación separada por versiones.

## [v3.0.0] - 2025-07-01

### Cambios importantes

- Reescritura completa de la librería desde cero.
  - Toda la arquitectura fue rediseñada para mejorar claridad, mantenibilidad y extensibilidad.
  - La mayoria de los métodos cambiaron de nombre.
  - Se eliminó el método `certificado` de `FacturaCfdi`. La configuración del certificado ahora se maneja exclusivamente desde la clase `ConfigCfdi`.
  - Se eliminó el método `crearSello` de las clases `FacturaCfdi` y `CartaPorte`. Ahora el sello se genera automáticamente al usar `crearXmlSellado`.
  - Se eliminarón los métodos `buscarEnCatalogo` y `obtenerCatalogo` de la clase `CatalogosSat`.

### Nuevas características

- Nuevos métodos en `FacturaCfdi` que agregan nodos como **Addenda** y **CFDI relacionados**.
- Nueva clase `ConfigCfdi` para centralizar la configuración del certificado (.cer, .key, y contraseña). Antes, estos datos se pasaban directamente a clases como `FacturaCfdi` y `CartaPorte`.
- Soporte para importación con **ES Modules** además de require() tradicional.
- Modularización de `CartaPorte` en clases según el tipo de transporte como:
  - `CartaPorteAutotransporte`
  - `CartaPorteMaritimo`
  - `CartaPorteFerroviario`
  - `CartaPorteAvereo`
- Nueva clase `Utils` con métodos utilitarios estáticos.
- Nuevo método `search` para la clase `CatalogosSat`.
