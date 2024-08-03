import {
  atributosInterface,
  atributosConceptoInterface,
  PDFInterface,
} from "./interfaces/facturaInterfaces";
const fs = require("fs");
const forge = require("node-forge");
const path = require("path");
import { CFDIIngreso } from "./clases/ingreso";
const { validateCer, validateKey } = require("./validadores/validador");
import crypto from "crypto";
import PDF from "./clases/PDF";
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
const xpath = require("xpath");
const SaxonJS = require("saxon-js");

export class FacturaCFDI {
  #noCertificado: string;
  #certificadoPem: string;
  #llavePrivadaPem: string | Buffer;
  #emisor: { Rfc: string; Nombre: string; RegimenFiscal: string | number };
  #receptor: {
    Rfc: string;
    Nombre: string;
    RegimenFiscal: string;
    DomicilioFiscalReceptor: string | number;
    RegimenFiscalReceptor: string | number;
    UsoCFDI: string;
  };
  #isGlobal: {
    periocidad: string | number;
    meses: string | number;
    anio: string | number;
  };

  #conceptos: atributosConceptoInterface[];
  constructor() {
    this.#noCertificado = "";
    this.#certificadoPem = "";
    this.#llavePrivadaPem = "";
    this.#emisor = { Rfc: "", Nombre: "", RegimenFiscal: "" };
    this.#receptor = {
      Rfc: "",
      Nombre: "",
      RegimenFiscal: "",
      DomicilioFiscalReceptor: "",
      RegimenFiscalReceptor: "",
      UsoCFDI: "",
    };
    this.#isGlobal = {
      periocidad: "",
      meses: "",
      anio: "",
    };

    this.#conceptos = [
      {
        ClaveProdServ: "",
        Cantidad: 0,
        ClaveUnidad: "",
        Unidad: "",
        Descripcion: "",
        ValorUnitario: 0,
        Importe: 0,
        ObjetoImp: "02",
        Descuento: null,
        Impuesto: { Impuesto: "", TipoFactor: "", TasaOCuota: 0 },
        NoIdentificacion: "",
      },
    ];
  }
  certificado(path: string) {
    try {
      validateCer(path);
      const file = fs.readFileSync(path);
      // Convertir el certificado DER a formato PEM
      const certAsn1 = forge.asn1.fromDer(file.toString("binary"));
      const cert = forge.pki.certificateFromAsn1(certAsn1);
      // Obtener el numero de serie del certificado
      this.#noCertificado = cert.serialNumber
        .match(/.{1,2}/g)
        .map(function (v: any) {
          return String.fromCharCode(parseInt(v, 16));
        })
        .join("");
      const pem = forge.pki.certificateToPem(cert);
      this.#certificadoPem = pem;
    } catch (error) {
      throw error;
    }
  }
  esGlobal(
    periocidad: string | number,
    meses: string | number,
    anio: string | number
  ) {
    this.#isGlobal.periocidad = periocidad;
    this.#isGlobal.meses = meses;
    this.#isGlobal.anio = anio;
  }
  crearSello(path: string, password: string) {
    // Convertir la llave privada DER a PEM
    validateKey(path, password);
    const file = fs.readFileSync(path);
    try {
      const pem = crypto.createPrivateKey({
        key: file,
        format: "der", // Indicamos que la llave está en formato DER
        type: "pkcs8",
        passphrase: password,
      });
      const pemString = pem.export({ format: "pem", type: "pkcs8" });
      this.#llavePrivadaPem = pemString;
    } catch (error) {
      throw error;
    }
  }
  crearEmisor(rfc: string, nombre: string, regimenFiscal: string | number) {
    this.#emisor.Rfc = rfc;
    this.#emisor.Nombre = nombre;
    this.#emisor.RegimenFiscal = regimenFiscal;
  }
  crearReceptor(
    rfc: string,
    nombre: string,
    regimenFiscal: string | number,
    codigoPostal: string | number,
    usoCfdi: string
  ) {
    this.#receptor.Rfc = rfc;
    this.#receptor.Nombre = nombre;
    this.#receptor.DomicilioFiscalReceptor = codigoPostal;
    this.#receptor.RegimenFiscalReceptor = regimenFiscal;
    this.#receptor.UsoCFDI = usoCfdi;
  }
  crearConceptos(conceptos: atributosConceptoInterface[]) {
    this.#conceptos = conceptos;
  }
  generarXml(atributos: atributosInterface) {
    const certificado = this.#certificadoPem
      .replace("-----BEGIN CERTIFICATE-----", "")
      .replace("-----END CERTIFICATE-----", "")
      .replace(/(\r\n|\n|\r)/gm, "");
    const xml = new CFDIIngreso(
      atributos,
      { ...this.#emisor },
      { ...this.#receptor },
      { ...this.#isGlobal },
      certificado,
      this.#noCertificado,
      this.#conceptos
    );
    return xml.crearXMl();
  }
  async generarXmlSellado(atributos: atributosInterface) {
    try {
      if (this.#llavePrivadaPem !== "") {
        const certificado = this.#certificadoPem
          .replace("-----BEGIN CERTIFICATE-----", "")
          .replace("-----END CERTIFICATE-----", "")
          .replace(/(\r\n|\n|\r)/gm, "");
        const xml = new CFDIIngreso(
          atributos,
          { ...this.#emisor },
          { ...this.#receptor },
          { ...this.#isGlobal },
          certificado,
          this.#noCertificado,
          this.#conceptos
        );
        const xmlSinSellar = xml.crearXMl();
        const selloCadenaOriginal = await this.#generarCadenaOrigen(
          xmlSinSellar
        );
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlSinSellar, "application/xml");
        // Encontrar el elemento cfdi:Comprobante y agregar el atributo sello
        const comprobanteElement =
          xmlDoc.getElementsByTagName("cfdi:Comprobante")[0];
        if (comprobanteElement) {
          comprobanteElement.setAttribute("Sello", selloCadenaOriginal);
        }
        const serializer = new XMLSerializer();
        const xmlSellado = serializer.serializeToString(xmlDoc);

        return xmlSellado;
      } else {
        throw new Error("La llave privada no ha sido proporcionada.");
      }
    } catch (error) {
      throw error;
    }
  }
  async #generarCadenaOrigen(xml: string) {
    try {
      const cadenaOriginalXslt = this.#resolveInclusions();
      let result = SaxonJS.XPath.evaluate(
        `transform(
        map {
          'source-node' : parse-xml-fragment($xml),
          'stylesheet-text' : $xslt,
          'delivery-format' : 'serialized'
          }
      )?output`,
        [],
        {
          params: {
            xml: xml,
            xslt: cadenaOriginalXslt,
          },
        }
      );

      const sign = crypto.createSign("SHA256");
      sign.update(result);
      sign.end();
      const signature = sign.sign(this.#llavePrivadaPem, "base64");
      return signature;
    } catch (error) {
      throw error;
    }
  }
  #resolveInclusions() {
    const basePath = path.resolve(__dirname, "resources", "xslt");
    const xsltFile = path.resolve(basePath, "./cadenaoriginal_4_0.xslt");
    const xsltContent = fs.readFileSync(xsltFile, "utf8");
    const doc = new DOMParser().parseFromString(xsltContent, "text/xml");
    const selectNameSpace = xpath.useNamespaces({
      xsl: "http://www.w3.org/1999/XSL/Transform",
      cfdi: "http://www.sat.gob.mx/cfd/4",
      xs: "http://www.w3.org/2001/XMLSchema",
      fn: "http://www.w3.org/2005/xpath-functions",
      cce11: "http://www.sat.gob.mx/ComercioExterior11",
      donat: "http://www.sat.gob.mx/donat",
      divisas: "http://www.sat.gob.mx/divisas",
      implocal: "http://www.sat.gob.mx/implocal",
      leyendasFisc: "http://www.sat.gob.mx/leyendasFiscales",
      pfic: "http://www.sat.gob.mx/pfic",
      tpe: "http://www.sat.gob.mx/TuristaPasajeroExtranjero",
      nomina12: "http://www.sat.gob.mx/nomina12",
      registrofiscal: "http://www.sat.gob.mx/registrofiscal",
      pagoenespecie: "http://www.sat.gob.mx/pagoenespecie",
      aerolineas: "http://www.sat.gob.mx/aerolineas",
      valesdedespensa: "http://www.sat.gob.mx/valesdedespensa",
      consumodecombustibles: "http://www.sat.gob.mx/consumodecombustibles",
      notariospublicos: "http://www.sat.gob.mx/notariospublicos",
      vehiculousado: "http://www.sat.gob.mx/vehiculousado",
      servicioparcial: "http://www.sat.gob.mx/servicioparcialconstruccion",
      decreto: "http://www.sat.gob.mx/renovacionysustitucionvehiculos",
      destruccion: "http://www.sat.gob.mx/certificadodestruccion",
      obrasarte: "http://www.sat.gob.mx/arteantiguedades",
      ine: "http://www.sat.gob.mx/ine",
      iedu: "http://www.sat.gob.mx/iedu",
      ventavehiculos: "http://www.sat.gob.mx/ventavehiculos",
      terceros: "http://www.sat.gob.mx/terceros",
      pago20: "http://www.sat.gob.mx/Pagos",
      detallista: "http://www.sat.gob.mx/detallista",
      ecc12: "http://www.sat.gob.mx/EstadoDeCuentaCombustible12",
      consumodecombustibles11: "http://www.sat.gob.mx/ConsumoDeCombustibles11",
      gceh: "http://www.sat.gob.mx/GastosHidrocarburos10",
      ieeh: "http://www.sat.gob.mx/IngresosHidrocarburos10",
      cartaporte20: "http://www.sat.gob.mx/CartaPorte20",
      cartaporte30: "http://www.sat.gob.mx/CartaPorte30",
      cartaporte31: "http://www.sat.gob.mx/CartaPorte31",
    });
    const includeNodes = selectNameSpace("//xsl:include", doc);

    includeNodes.forEach((node: any) => {
      const href = node.getAttribute("href");
      if (href) {
        const includePath = path.resolve(basePath, href);

        const includeContent = fs.readFileSync(includePath, "utf8");
        const includeDoc = new DOMParser().parseFromString(
          includeContent,
          "application/xml"
        );
        // Clonar y añadir los hijos del includeDoc en lugar de reemplazar el nodo
        while (includeDoc.documentElement.childNodes.length > 0) {
          const importedNode = includeDoc.documentElement.childNodes[0];
          node.parentNode.insertBefore(importedNode, node);
        }

        // Eliminar el nodo de inclusión original
        node.parentNode.removeChild(node);
      }
    });
    const result = new XMLSerializer().serializeToString(doc);
    return result;
  }
  async generarPDF(params: PDFInterface) {
    try {
      const pdf = new PDF(params);
      const file = await pdf.createIngresoPDF();

      return file;
    } catch (error) {
      throw error;
    }
  }
}
