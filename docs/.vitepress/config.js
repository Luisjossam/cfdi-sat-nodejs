export default {
  base: "/cfdi-sat-nodejs/",
  title: "cfdi-sat-nodejs",
  description: "Generador CFDI 4.0, Carta Porte 3.1 y más en Node.js",
  cleanUrls: true,
  head: [["meta", { name: "keywords", content: "CFDI, SAT, Node.js, npm, github, facturación, México" }]],
  themeConfig: {
    appearance: "force-dark",
    logo: "/20250702_124031.png",
    siteTitle: false,
    nav: [
      { text: "Inicio", link: "/" },
      {
        text: "Docs",
        items: [
          { text: "v3.1.x", link: "/v3.1/docs/" },
          { text: "v3.0.x", link: "/v3.0/docs/" },
        ],
      },
      {
        text: "Changelog",
        link: "/changelog",
      },
      { text: "GitHub", link: "https://github.com/Luisjossam/cfdi-sat-nodejs" },
    ],
    sidebar: {
      "/v3.1/": [
        {
          text: "Empezando",
          items: [
            { text: "Introducción", link: "/v3.1/docs/" },
            { text: "Instalación", link: "/v3.1/docs/instalacion" },
            { text: "Importación y primer uso", link: "/v3.1/docs/importacion-y-primer-uso" },
          ],
        },
        {
          text: "ConfigCfdi",
          items: [
            { text: "Clase ConfigCfdi", link: "/v3.1/docs/config-cfdi/clase-configcfdi" },
            { text: "getCert", link: "/v3.1/docs/config-cfdi/getcert" },
            { text: "getKeyPem", link: "/v3.1/docs/config-cfdi/getKeyPem" },
          ],
        },
        {
          text: "FacturaCfdi",
          items: [
            { text: "Clase FacturaCfdi", link: "/v3.1/docs/factura-cfdi/clase-facturacfdi" },
            { text: "createNodeComprobante", link: "/v3.1/docs/factura-cfdi/createnodecomprobante" },
            { text: "createNodeInformacionGlobal", link: "/v3.1/docs/factura-cfdi/createnodeinformacionglobal" },
            { text: "createNodeRelacionados", link: "/v3.1/docs/factura-cfdi/createnoderelacionados" },
            { text: "createNodeEmisor", link: "/v3.1/docs/factura-cfdi/createnodeemisor" },
            { text: "createNodeReceptor", link: "/v3.1/docs/factura-cfdi/createnodereceptor" },
            { text: "createNodeConcepto", link: "/v3.1/docs/factura-cfdi/createnodeconcepto" },
            { text: "createNodeAddenda", link: "/v3.1/docs/factura-cfdi/createnodeaddenda" },
            { text: "createXml y createXmlSellado", link: "/v3.1/docs/factura-cfdi/createxml-y-createxmlsellado" },
            { text: "createJson y createJsonSellado", link: "/v3.1/docs/factura-cfdi/createjson-y-createjsonsellado" },
          ],
        },
        {
          text: "Pagos",
          items: [
            { text: "Clase Pagos", link: "/v3.1/docs/pagos/Clase-Pagos" },
            { text: "createNodeTotales", link: "/v3.1/docs/pagos/createNodeTotales" },
            { text: "createNodePago", link: "/v3.1/docs/pagos/createNodePago" },
            { text: "createXmlSellado", link: "/v3.1/docs/pagos/createXmlSellado" },
            { text: "createJsonSellado", link: "/v3.1/docs/pagos/createJsonSellado" },
          ],
        },
        {
          text: "CartaPorte",
          items: [
            { text: "Clase CartaPorte", link: "/v3.1/docs/carta-porte/clase-cartaporte" },
            { text: "setAttributes", link: "/v3.1/docs/carta-porte/setattributes" },
            { text: "createNodeRegimenesAduaneros", link: "/v3.1/docs/carta-porte/createnoderegimenesaduaneros" },
            { text: "createNodeUbicacion", link: "/v3.1/docs/carta-porte/createnodeubicacion" },
            { text: "createNodeMercancias", link: "/v3.1/docs/carta-porte/createnodemercancias" },
            { text: "createNodeMercancia", link: "/v3.1/docs/carta-porte/createnodemercancia" },
            { text: "createNodeTipoFigura", link: "/v3.1/docs/carta-porte/createNodeTipoFigura" },
            { text: "createXmlSellado", link: "/v3.1/docs/carta-porte/createxmlsellado" },
            { text: "createJsonSellado", link: "/v3.1/docs/carta-porte/createjsonsellado" },
          ],
        },
        {
          text: "CartaPorteAutotransporte",
          items: [
            { text: "Clase CartaPorteAutotransporte", link: "/v3.1/docs/carta-porte-autotransporte/clase-CartaPorteAutotransporte" },
            { text: "createNodeAutotransporte", link: "/v3.1/docs/carta-porte-autotransporte/createNodeAutotransporte" },
            { text: "createNodeIdentificacionVehicular", link: "/v3.1/docs/carta-porte-autotransporte/createNodeIdentificacionVehicular" },
            { text: "createNodeRemolques", link: "/v3.1/docs/carta-porte-autotransporte/createNodeRemolques" },
          ],
        },
        {
          text: "CartaPorteMaritimo",
          items: [
            { text: "Clase CartaPorteMaritimo", link: "/v3.1/docs/carta-porte-maritimo/clase-CartaPorteMaritimo" },
            { text: "createNodeMaritimo", link: "/v3.1/docs/carta-porte-maritimo/createNodeMaritimo" },
            { text: "createNodeContenedor", link: "/v3.1/docs/carta-porte-maritimo/createNodeContenedor" },
          ],
        },
        {
          text: "CartaPorteAereo",
          items: [
            { text: "Clase CartaPorteAereo", link: "/v3.1/docs/carta-porte-aereo/clase-CartaPorteAereo" },
            { text: "createNodeAereo", link: "/v3.1/docs/carta-porte-aereo/createNodeAereo" },
          ],
        },
        {
          text: "CartaPorteFerroviario",
          items: [
            { text: "Clase CartaPorteFerroviario", link: "/v3.1/docs/carta-porte-ferroviario/clase-CartaPorteFerroviario" },
            { text: "createNodeFerroviario", link: "/v3.1/docs/carta-porte-ferroviario/createNodeFerroviario" },
            { text: "createNodeDerechoDePaso", link: "/v3.1/docs/carta-porte-ferroviario/createNodeDerechoDePaso" },
            { text: "createNodeCarro", link: "/v3.1/docs/carta-porte-ferroviario/createNodeCarro" },
          ],
        },
        {
          text: "Utils",
          items: [
            {
              text: "Clase Utils",
              link: "/v3.1/docs/utils/Clase-Utils",
            },
            {
              text: "dateCurrent",
              link: "/v3.1/docs/utils/dateCurrent",
            },
            {
              text: "generateIdCcp",
              link: "/v3.1/docs/utils/generateIdCcp",
            },
            {
              text: "generateUuid",
              link: "/v3.1/docs/utils/generateUuid",
            },
            {
              text: "jsonToXml",
              link: "/v3.1/docs/utils/jsonToXml",
            },
            {
              text: "sanitizeText",
              link: "/v3.1/docs/utils/sanitizeText",
            },
            {
              text: "xmlToJson",
              link: "/v3.1/docs/utils/xmlToJson",
            },
          ],
        },
      ],
      "/v3.0/": [
        {
          text: "Empezando",
          items: [
            { text: "Introducción", link: "/v3.0/docs/" },
            { text: "Instalación", link: "/v3.0/docs/instalacion" },
            { text: "Importación y primer uso", link: "/v3.0/docs/importacion-y-primer-uso" },
          ],
        },
        {
          text: "ConfigCfdi",
          items: [
            { text: "Clase ConfigCfdi", link: "/v3.0/docs/config-cfdi/clase-configcfdi" },
            { text: "getCert", link: "/v3.0/docs/config-cfdi/getcert" },
            { text: "getKeyPem", link: "/v3.0/docs/config-cfdi/getKeyPem" },
          ],
        },
        {
          text: "FacturaCfdi",
          items: [
            { text: "Clase FacturaCfdi", link: "/v3.0/docs/factura-cfdi/clase-facturacfdi" },
            { text: "createNodeComprobante", link: "/v3.0/docs/factura-cfdi/createnodecomprobante" },
            { text: "createNodeInformacionGlobal", link: "/v3.0/docs/factura-cfdi/createnodeinformacionglobal" },
            { text: "createNodeRelacionados", link: "/v3.0/docs/factura-cfdi/createnoderelacionados" },
            { text: "createNodeEmisor", link: "/v3.0/docs/factura-cfdi/createnodeemisor" },
            { text: "createNodeReceptor", link: "/v3.0/docs/factura-cfdi/createnodereceptor" },
            { text: "createNodeConcepto", link: "/v3.0/docs/factura-cfdi/createnodeconcepto" },
            { text: "createNodeAddenda", link: "/v3.0/docs/factura-cfdi/createnodeaddenda" },
            { text: "createXml y createXmlSellado", link: "/v3.0/docs/factura-cfdi/createxml-y-createxmlsellado" },
            { text: "createJson y createJsonSellado", link: "/v3.0/docs/factura-cfdi/createjson-y-createjsonsellado" },
          ],
        },
        {
          text: "CartaPorte",
          items: [
            { text: "Clase CartaPorte", link: "/v3.0/docs/carta-porte/clase-cartaporte" },
            { text: "setAttributes", link: "/v3.0/docs/carta-porte/setattributes" },
            { text: "createNodeRegimenesAduaneros", link: "/v3.0/docs/carta-porte/createnoderegimenesaduaneros" },
            { text: "createNodeUbicacion", link: "/v3.0/docs/carta-porte/createnodeubicacion" },
            { text: "createNodeMercancias", link: "/v3.0/docs/carta-porte/createnodemercancias" },
            { text: "createNodeMercancia", link: "/v3.0/docs/carta-porte/createnodemercancia" },
            { text: "createNodeTipoFigura", link: "/v3.0/docs/carta-porte/createNodeTipoFigura" },
            { text: "createXmlSellado", link: "/v3.0/docs/carta-porte/createxmlsellado" },
            { text: "createJsonSellado", link: "/v3.0/docs/carta-porte/createjsonsellado" },
          ],
        },
        {
          text: "CartaPorteAutotransporte",
          items: [
            { text: "Clase CartaPorteAutotransporte", link: "/v3.0/docs/carta-porte-autotransporte/clase-CartaPorteAutotransporte" },
            { text: "createNodeAutotransporte", link: "/v3.0/docs/carta-porte-autotransporte/createNodeAutotransporte" },
            { text: "createNodeIdentificacionVehicular", link: "/v3.0/docs/carta-porte-autotransporte/createNodeIdentificacionVehicular" },
            { text: "createNodeRemolques", link: "/v3.0/docs/carta-porte-autotransporte/createNodeRemolques" },
          ],
        },
        {
          text: "CartaPorteMaritimo",
          items: [
            { text: "Clase CartaPorteMaritimo", link: "/v3.0/docs/carta-porte-maritimo/clase-CartaPorteMaritimo" },
            { text: "createNodeMaritimo", link: "/v3.0/docs/carta-porte-maritimo/createNodeMaritimo" },
            { text: "createNodeContenedor", link: "/v3.0/docs/carta-porte-maritimo/createNodeContenedor" },
          ],
        },
        {
          text: "CartaPorteAereo",
          items: [
            { text: "Clase CartaPorteAereo", link: "/v3.0/docs/carta-porte-aereo/clase-CartaPorteAereo" },
            { text: "createNodeAereo", link: "/v3.0/docs/carta-porte-aereo/createNodeAereo" },
          ],
        },
        {
          text: "CartaPorteFerroviario",
          items: [
            { text: "Clase CartaPorteFerroviario", link: "/v3.0/docs/carta-porte-ferroviario/clase-CartaPorteFerroviario" },
            { text: "createNodeFerroviario", link: "/v3.0/docs/carta-porte-ferroviario/createNodeFerroviario" },
            { text: "createNodeDerechoDePaso", link: "/v3.0/docs/carta-porte-ferroviario/createNodeDerechoDePaso" },
            { text: "createNodeCarro", link: "/v3.0/docs/carta-porte-ferroviario/createNodeCarro" },
          ],
        },
      ],
    },
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
