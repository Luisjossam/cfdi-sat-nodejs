export default {
  title: "cfdi-sat-nodejs",
  description: "Generador CFDI 4.0, Carta Porte 3.1 y más en Node.js",
  themeConfig: {
    appearance: "force-dark",
    logo: "/20250702_124031.png",
    siteTitle: false,

    nav: [
      { text: "Inicio", link: "/" },
      { text: "Docs", items: [{ text: "v3", link: "/docs/v3.0/" }] },
      { text: "GitHub", link: "https://github.com/Luisjossam/cfdi-sat-nodejs" },
    ],
    sidebar: [
      {
        text: "Empezando",
        items: [
          { text: "Introducción", link: "/docs/v3.0/" },
          { text: "Instalación", link: "/docs/v3.0/instalacion" },
          { text: "Importación y primer uso", link: "/docs/v3.0/importacion-y-primer-uso" },
        ],
      },
      {
        text: "ConfigCfdi",
        items: [
          { text: "Clase ConfigCfdi", link: "/docs/v3.0/config-cfdi/clase-configcfdi" },
          { text: "getCert", link: "/docs/v3.0/config-cfdi/getcert" },
          { text: "getKeyPem", link: "/docs/v3.0/config-cfdi/getKeyPem" },
        ],
      },
      {
        text: "FacturaCfdi",
        items: [
          { text: "Clase FacturaCfdi", link: "/docs/v3.0/factura-cfdi/clase-facturacfdi" },
          { text: "createNodeComprobante", link: "/docs/v3.0/factura-cfdi/createnodecomprobante" },
          { text: "createNodeInformacionGlobal", link: "/docs/v3.0/factura-cfdi/createnodeinformacionglobal" },
          { text: "createNodeRelacionados", link: "/docs/v3.0/factura-cfdi/createnoderelacionados" },
          { text: "createNodeEmisor", link: "/docs/v3.0/factura-cfdi/createnodeemisor" },
          { text: "createNodeReceptor", link: "/docs/v3.0/factura-cfdi/createnodereceptor" },
          { text: "createNodeConcepto", link: "/docs/v3.0/factura-cfdi/createnodeconcepto" },
          { text: "createNodeAddenda", link: "/docs/v3.0/factura-cfdi/createnodeaddenda" },
          { text: "createXml y createXmlSellado", link: "/docs/v3.0/factura-cfdi/createxml-y-createxmlsellado" },
          { text: "createJson y createJsonSellado", link: "/docs/v3.0/factura-cfdi/createjson-y-createjsonsellado" },
        ],
      },
      {
        text: "CartaPorte",
        items: [
          { text: "Clase CartaPorte", link: "/docs/v3.0/carta-porte/clase-cartaporte" },
          { text: "setAttributes", link: "/docs/v3.0/carta-porte/setattributes" },
          { text: "createNodeRegimenesAduaneros", link: "/docs/v3.0/carta-porte/createnoderegimenesaduaneros" },
          { text: "createNodeUbicacion", link: "/docs/v3.0/carta-porte/createnodeubicacion" },
          { text: "createNodeMercancias", link: "/docs/v3.0/carta-porte/createnodemercancias" },
          { text: "createNodeMercancia", link: "/docs/v3.0/carta-porte/createnodemercancia" },
          { text: "createNodeTipoFigura", link: "/docs/v3.0/carta-porte/createNodeTipoFigura" },
          { text: "createXmlSellado", link: "/docs/v3.0/carta-porte/createxmlsellado" },
          { text: "createJsonSellado", link: "/docs/v3.0/carta-porte/createjsonsellado" },
        ],
      },
      {
        text: "CartaPorteAutotransporte",
        items: [
          { text: "Clase CartaPorteAutotransporte", link: "/docs/v3.0/carta-porte-autotransporte/clase-CartaPorteAutotransporte" },
          { text: "createNodeAutotransporte", link: "/docs/v3.0/carta-porte-autotransporte/createNodeAutotransporte" },
          { text: "createNodeIdentificacionVehicular", link: "/docs/v3.0/carta-porte-autotransporte/createNodeIdentificacionVehicular" },
          { text: "createNodeRemolques", link: "/docs/v3.0/carta-porte-autotransporte/createNodeRemolques" },
        ],
      },
      {
        text: "CartaPorteMaritimo",
        items: [
          { text: "Clase CartaPorteMaritimo", link: "/docs/v3.0/carta-porte-maritimo/clase-CartaPorteMaritimo" },
          { text: "createNodeMaritimo", link: "/docs/v3.0/carta-porte-maritimo/createNodeMaritimo" },
          { text: "createNodeContenedor", link: "/docs/v3.0/carta-porte-maritimo/createNodeContenedor" },
        ],
      },
      {
        text: "CartaPorteAereo",
        items: [
          { text: "Clase CartaPorteAereo", link: "/docs/v3.0/carta-porte-aereo/clase-CartaPorteAereo" },
          { text: "createNodeAereo", link: "/docs/v3.0/carta-porte-aereo/createNodeAereo" },
        ],
      },
      {
        text: "CartaPorteFerroviario",
        items: [
          { text: "Clase CartaPorteFerroviario", link: "/docs/v3.0/carta-porte-ferroviario/clase-CartaPorteFerroviario" },
          { text: "createNodeFerroviario", link: "/docs/v3.0/carta-porte-ferroviario/createNodeFerroviario" },
          { text: "createNodeDerechoDePaso", link: "/docs/v3.0/carta-porte-ferroviario/createNodeDerechoDePaso" },
          { text: "createNodeCarro", link: "/docs/v3.0/carta-porte-ferroviario/createNodeCarro" },
        ],
      },
      {
        text: "Validador",
        items: [{ text: "Lista de errores", link: "/docs/v3.0/validador/lista-de-errores" }],
      },
    ],
    footer: {
      message: "Lanzado bajo la licencia MIT.",
      copyright: "Copyright © 2025 Luis Martinez",
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        css: {
          additionalData: '@import "./theme/style.css";',
        },
      },
    },
  },
};
