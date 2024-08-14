import {
  atributosInterface,
  atributosConceptoInterface,
  PDFInterface,
  catalogoResult,
  atributosCartaPorteInterface,
  ubicacionOrigenInterface,
  ubicacionDestinoInterface,
  mercanciasInterface,
  itemMercanciaInterface,
  ArrayMercanciaInterface,
  documentacionAduaneraInterface,
  cantidadTransportaInterface,
  autotransporteInterface,
  identificacionVehicularInterface,
  segurosInterface,
  remolquesInterface,
  tipoFiguraInterface,
  partesTransporteInterface,
  domicilioInterface,
} from "./interfaces/facturaInterfaces";
import fs from "fs";
const forge = require("node-forge");
const path = require("path");
import { CFDIIngreso } from "./clases/ingreso";
const { validateCer, validateKey } = require("./validadores/validador");
import crypto from "crypto";
import PDF from "./clases/PDF";
import { v4 as uuidv4 } from "uuid";
import { pd } from "pretty-data";
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
const xpath = require("xpath");
const SaxonJS = require("saxon-js");
const basePath = path.resolve(__dirname, "resources", "catalogos");

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
        format: "der",
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
        let xmlSellado = xmlSinSellar;
        if (this.#llavePrivadaPem !== "") {
          const selloCadenaOriginal = await this.#generarCadenaOrigen(
            xmlSinSellar
          );
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(
            xmlSinSellar,
            "application/xml"
          );
          // Encontrar el elemento cfdi:Comprobante y agregar el atributo sello
          const comprobanteElement =
            xmlDoc.getElementsByTagName("cfdi:Comprobante")[0];
          if (comprobanteElement) {
            comprobanteElement.setAttribute("Sello", selloCadenaOriginal);
          }
          const serializer = new XMLSerializer();
          xmlSellado = serializer.serializeToString(xmlDoc);
        }

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
export class CatalogosSAT {
  constructor() {}
  obtenerCatalogo(nombreCatalogo: string): catalogoResult {
    try {
      const snake_case = nombreCatalogo
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/^_/, "");
      const json_file = path.join(basePath, `cat_${snake_case}.json`);
      if (fs.existsSync(json_file)) {
        const data = fs.readFileSync(json_file, "utf8");
        return {
          status: true,
          data: JSON.parse(data),
        };
      } else {
        return {
          status: false,
          data: null,
          message: `El catálogo "${nombreCatalogo}" no existe.`,
        };
      }
    } catch (error) {
      throw new Error(`Error al importar el catalogo "${nombreCatalogo}"`);
    }
  }
  buscarEnCatalogo(
    valor: string,
    clave: string,
    nombreCatalogo: string
  ): catalogoResult | undefined {
    try {
      const catalogo = this.obtenerCatalogo(nombreCatalogo);
      if (catalogo.status) {
        const filter = catalogo.data.find((item: any) => item[clave] === valor);
        if (filter) {
          return {
            status: true,
            data: filter,
          };
        } else {
          return {
            status: false,
            data: null,
            message: `Clave "${valor}" no encontrada en el catálogo "${nombreCatalogo}"`,
          };
        }
      } else {
        return {
          status: false,
          message: `El catálogo "${nombreCatalogo}" no existe.`,
        };
      }
    } catch (error) {
      return {
        status: false,
        message: `Error al buscar en el catálogo.`,
      };
    }
  }
}
export class CartaPorte {
  #xml: string;
  #regimenesAduaneros: string[];
  #ubicacionOrigen: Array<ubicacionOrigenInterface>;
  #ubicacionDestino: Array<ubicacionDestinoInterface>;
  #mercancias: mercanciasInterface;
  #conceptosMercancias: Array<ArrayMercanciaInterface>;
  #esAutotransporte: boolean;
  #autotransporte: autotransporteInterface;
  #identificacionVehicular: identificacionVehicularInterface;
  #seguros: Array<segurosInterface>;
  #remolques: Array<remolquesInterface>;
  #tipoFigura: Array<tipoFiguraInterface>;
  #llavePrivadaPem: string | Buffer;
  constructor(xml: string) {
    this.#xml = xml;
    this.#llavePrivadaPem = "";
    this.#regimenesAduaneros = [];
    this.#ubicacionOrigen = [];
    this.#ubicacionDestino = [];
    this.#mercancias = {
      PesoBrutoTotal: "",
      UnidadPeso: "",
      NumTotalMercancias: "",
    };
    this.#conceptosMercancias = [];
    this.#esAutotransporte = false;
    this.#autotransporte = {
      PermSCT: "",
      NumPermisoSCT: "",
    };
    this.#identificacionVehicular = {
      ConfigVehicular: "",
      PesoBrutoVehicular: "",
      PlacaVM: "",
      AnioModeloVM: "",
    };
    this.#seguros = [];
    this.#remolques = [];
    this.#tipoFigura = [];
  }
  #generarIdCCP(): string {
    const id = uuidv4();
    return `CCC${id.slice(3)}`;
  }
  crearRegimenesAduaneros(array: string[]): void {
    this.#regimenesAduaneros = array;
  }
  crearUbicacionOrigen(data: ubicacionOrigenInterface): void {
    this.#ubicacionOrigen.push({ ...data });
  }
  crearUbicacionDestino(data: ubicacionDestinoInterface): void {
    this.#ubicacionDestino.push({ ...data });
  }
  crearMercancias(data: mercanciasInterface): void {
    this.#mercancias = data;
  }
  crearMercancia(data: itemMercanciaInterface): this {
    this.#conceptosMercancias.push({ mercancia: data });
    return this;
  }
  crearDocumentacionAduanera(data: documentacionAduaneraInterface): this {
    const lastIndex = this.#conceptosMercancias.length - 1;
    if (lastIndex >= 0) {
      const lastItem = this.#conceptosMercancias[lastIndex];
      lastItem.documentacionAduanera = data;
    }
    return this;
  }
  crearCantidadTransporta(data: cantidadTransportaInterface): void {
    const lastIndex = this.#conceptosMercancias.length - 1;
    if (lastIndex >= 0) {
      const lastItem = this.#conceptosMercancias[lastIndex];
      if (!("cantidadTransporta" in lastItem)) {
        lastItem.cantidadTransporta = [];
      }
      lastItem.cantidadTransporta?.push({ ...data });
    }
  }
  // METODOS PARA AUTOTRANSPORTE
  crearAutotransporte(data: autotransporteInterface): this {
    this.#autotransporte = data;
    this.#esAutotransporte = true;
    return this;
  }
  crearIdentificacionVehicular(data: identificacionVehicularInterface): this {
    this.#identificacionVehicular = data;
    return this;
  }
  crearSeguros(data: segurosInterface): this {
    this.#seguros.push({ ...data });
    return this;
  }
  crearRemolques(data: remolquesInterface): this {
    this.#remolques.push({ ...data });
    return this;
  }
  crearTipoFigura(data: tipoFiguraInterface): this {
    this.#tipoFigura.push({ ...data });
    return this;
  }
  crearPartesTransporte(data: partesTransporteInterface): this {
    const lastIndex = this.#tipoFigura.length - 1;
    if (lastIndex >= 0) {
      const lastItem = this.#tipoFigura[lastIndex];
      if (!("PartesTransporte" in lastItem)) {
        lastItem.PartesTransporte = [];
      }
      lastItem.PartesTransporte?.push({ ...data });
    }
    return this;
  }
  crearDomicilioTipoFigura(data: domicilioInterface): this {
    const lastIndex = this.#tipoFigura.length - 1;
    if (lastIndex >= 0) {
      const lastItem = this.#tipoFigura[lastIndex];
      lastItem.Domicilio = data;
    }
    return this;
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
  crearSello(path: string, password: string) {
    // Convertir la llave privada DER a PEM
    validateKey(path, password);
    const file = fs.readFileSync(path);
    try {
      const pem = crypto.createPrivateKey({
        key: file,
        format: "der",
        type: "pkcs8",
        passphrase: password,
      });
      const pemString = pem.export({ format: "pem", type: "pkcs8" });
      this.#llavePrivadaPem = pemString;
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
  async generarCartaPorte(atributos: atributosCartaPorteInterface) {
    if (this.#xml) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(this.#xml, "application/xml");
      const xmlTimbrado = xmlDoc.getElementsByTagName(
        "tfd:TimbreFiscalDigital"
      );

      if (xmlTimbrado.length === 0) {
        const node_base = xmlDoc.getElementsByTagName("cfdi:Comprobante")[0];
        node_base.setAttribute(
          "xmlns:cartaporte31",
          "http://www.sat.gob.mx/CartaPorte31"
        );
        node_base.setAttribute(
          "xsi:schemaLocation",
          "http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd http://www.sat.gob.mx/CartaPorte31 http://www.sat.gob.mx/sitio_internet/cfd/CartaPorte/CartaPorte31.xsd"
        );
        const complementoNode = node_base.appendChild(
          xmlDoc.createElement("cfdi:Complemento")
        );
        const cp_node = complementoNode.appendChild(
          xmlDoc.createElement("cartaporte31:CartaPorte")
        );
        cp_node.setAttribute("Version", "3.1");
        cp_node.setAttribute("IdCCP", this.#generarIdCCP());
        // AGREGAR ATRIBUTOS AL NODO CartaPorte
        // Verificar si existe EntradaSalidaMerc en el parámetro atributos
        if (atributos.EntradaSalidaMerc && atributos.EntradaSalidaMerc !== "")
          cp_node.setAttribute(
            "EntradaSalidaMerc",
            atributos.EntradaSalidaMerc
          );
        // Verificar si existe TranspInternac en el parámetro atributos
        if (
          "TranspInternac" in atributos &&
          typeof atributos.TranspInternac === "boolean"
        ) {
          cp_node.setAttribute(
            "TranspInternac",
            atributos.TranspInternac ? "Sí" : "No"
          );
          if (atributos.TranspInternac) {
            const regimenesAduaneros_node = cp_node.appendChild(
              xmlDoc.createElement("cartaporte31:RegimenesAduaneros")
            );
            this.#regimenesAduaneros.forEach((item) => {
              if (item !== "") {
                const regimenAduaneroCCP = regimenesAduaneros_node.appendChild(
                  xmlDoc.createElement("cartaporte31:RegimenAduaneroCCP")
                );
                regimenAduaneroCCP.setAttribute("RegimenAduanero", item);
              }
            });
          }
        }
        // Verificar si existe PaisOrigenDestino en el parámetro atributos
        if (
          atributos.PaisOrigenDestino &&
          atributos.PaisOrigenDestino.trim() !== ""
        )
          cp_node.setAttribute(
            "PaisOrigenDestino",
            atributos.PaisOrigenDestino
          );
        // Verificar si existe ViaEntradaSalida en el parámetro atributos
        if (atributos.ViaEntradaSalida && atributos.ViaEntradaSalida !== "")
          cp_node.setAttribute(
            "ViaEntradaSalida",
            atributos.ViaEntradaSalida.toString()
          );
        // Verificar si existe TotalDistRec en el parámetro atributos
        if (atributos.TotalDistRec && atributos.TotalDistRec !== "")
          cp_node.setAttribute(
            "TotalDistRec",
            atributos.TotalDistRec.toString()
          );
        // En caso de aplicar Istmo
        if (
          "RegistroISTMO" in atributos &&
          typeof atributos.RegistroISTMO === "boolean"
        ) {
          cp_node.setAttribute(
            "RegistroISTMO",
            atributos.RegistroISTMO ? "Sí" : "No"
          );
          if (atributos.RegistroISTMO) {
            // Verificar si existe UbicacionPoloOrigen en el parámetro atributos
            if (
              atributos.UbicacionPoloOrigen &&
              atributos.UbicacionPoloOrigen !== ""
            )
              cp_node.setAttribute(
                "UbicacionPoloOrigen",
                atributos.UbicacionPoloOrigen.toString()
              );
            // Verificar si existe UbicacionPoloDestino en el parámetro atributos
            if (
              atributos.UbicacionPoloDestino &&
              atributos.UbicacionPoloDestino !== ""
            )
              cp_node.setAttribute(
                "UbicacionPoloDestino",
                atributos.UbicacionPoloDestino.toString()
              );
          }
        }
        const ubicaciones_node = cp_node.appendChild(
          xmlDoc.createElement("cartaporte31:Ubicaciones")
        );
        const keyAddress: (keyof ubicacionDestinoInterface)[] = [
          "Calle",
          "NumeroExterior",
          "NumeroInterior",
          "Colonia",
          "Localidad",
          "Referencia",
          "Municipio",
          "Estado",
          "Pais",
          "CodigoPostal",
        ];
        // UBICACION ORIGEN
        const ubicacion_origen_node = ubicaciones_node.appendChild(
          xmlDoc.createElement("Ubicacion")
        );
        ubicacion_origen_node.setAttribute("TipoUbicacion", "Origen");
        const domicilio_origen_node = ubicacion_origen_node.appendChild(
          xmlDoc.createElement("Domicilio")
        );
        this.#ubicacionOrigen.forEach((item) => {
          Object.keys(item).forEach((key) => {
            const typedKey = key as keyof ubicacionOrigenInterface;
            const value = item[typedKey];
            if (value !== undefined) {
              if (!keyAddress.includes(typedKey)) {
                ubicacion_origen_node.setAttribute(key, value.toString());
              } else {
                domicilio_origen_node.setAttribute(key, value.toString());
              }
            }
          });
        });

        // UBICACION DESTINO
        const ubicacion_destino_node = ubicaciones_node.appendChild(
          xmlDoc.createElement("cartaporte31:Ubicacion")
        );
        ubicacion_destino_node.setAttribute("TipoUbicacion", "Destino");
        const domicilio_destino_node = ubicacion_destino_node.appendChild(
          xmlDoc.createElement("cartaporte31:Domicilio")
        );
        this.#ubicacionDestino.forEach((item) => {
          Object.keys(item).forEach((key) => {
            const typedKey = key as keyof ubicacionDestinoInterface;
            const value = item[typedKey];
            if (value !== undefined) {
              if (!keyAddress.includes(typedKey)) {
                ubicacion_destino_node.setAttribute(key, value.toString());
              } else {
                domicilio_destino_node.setAttribute(key, value.toString());
              }
            }
          });
        });

        const mercancias_node = cp_node.appendChild(
          xmlDoc.createElement("cartaporte31:Mercancias")
        );
        Object.keys(this.#mercancias).forEach((key) => {
          const typedKey = key as keyof mercanciasInterface;
          const value = this.#mercancias[typedKey];
          if (value !== undefined) {
            if (key == "LogisticaInversaRecoleccionDevolucion") {
              mercancias_node.setAttribute(key, value === true ? "Sí" : "No");
            } else {
              mercancias_node.setAttribute(key, value.toString());
            }
          }
        });
        this.#conceptosMercancias.forEach((item: ArrayMercanciaInterface) => {
          const mercancia_node = mercancias_node.appendChild(
            xmlDoc.createElement("cartaporte31:Mercancia")
          );
          Object.keys(item.mercancia).forEach((key) => {
            const typedKey = key as keyof itemMercanciaInterface;
            const value = item.mercancia[typedKey];
            if (value !== undefined) {
              mercancia_node.setAttribute(key, value.toString());
            }
          });
          if ("documentacionAduanera" in item) {
            const docAduanera_node = mercancia_node.appendChild(
              xmlDoc.createElement("cartaporte31:DocumentacionAduanera")
            );
            Object.keys(item.documentacionAduanera!).forEach((key) => {
              const typedKey = key as keyof documentacionAduaneraInterface;
              const value = item.documentacionAduanera![typedKey];
              if (value !== undefined) {
                docAduanera_node.setAttribute(key, value.toString());
              }
            });
          }
          if ("cantidadTransporta" in item) {
            item.cantidadTransporta?.forEach((canTranporta: any) => {
              const cantTransporta_node = mercancia_node.appendChild(
                xmlDoc.createElement("cartaporte31:CantidadTransporta")
              );
              Object.keys(canTranporta).forEach((key) => {
                const typedKey = key as keyof documentacionAduaneraInterface;
                const value = canTranporta[typedKey];
                if (value !== undefined) {
                  cantTransporta_node.setAttribute(key, value.toString());
                }
              });
            });
          }
        });
        // CONDICIONES PARA COLOCAR SOLO LOS ELEMENTOS NECESARIOS PARA CADA TIPO DE TRANSPORTE
        if (this.#esAutotransporte) {
          const autotransporte_node = mercancias_node.appendChild(
            xmlDoc.createElement("cartaporte31:Autotransporte")
          );
          Object.keys(this.#autotransporte).forEach((key) => {
            const typedKey = key as keyof autotransporteInterface;
            const value = this.#autotransporte[typedKey];
            if (value !== undefined) {
              autotransporte_node.setAttribute(key, value.toString());
            }
          });
          const inden_vehicular_node = autotransporte_node.appendChild(
            xmlDoc.createElement("cartaporte31:IdentificacionVehicular")
          );
          Object.keys(this.#identificacionVehicular).forEach((key) => {
            const typedKey = key as keyof identificacionVehicularInterface;
            const value = this.#identificacionVehicular[typedKey];
            if (value !== undefined) {
              inden_vehicular_node.setAttribute(key, value.toString());
            }
          });
          this.#seguros.forEach((item) => {
            const seguro_node = autotransporte_node.appendChild(
              xmlDoc.createElement("cartaporte31:Seguros")
            );
            Object.keys(item).forEach((key) => {
              const typedKey = key as keyof segurosInterface;
              const value = item[typedKey];
              if (value !== undefined) {
                seguro_node.setAttribute(key, value.toString());
              }
            });
          });
          const remolques_node = autotransporte_node.appendChild(
            xmlDoc.createElement("cartaporte31:Remolques")
          );
          this.#remolques.forEach((item) => {
            const remolque_node = remolques_node.appendChild(
              xmlDoc.createElement("cartaporte31:Remolque")
            );
            Object.keys(item).forEach((key) => {
              const typedKey = key as keyof remolquesInterface;
              const value = item[typedKey];
              if (value !== undefined) {
                remolque_node.setAttribute(key, value.toString());
              }
            });
          });
        }
        const figTransporte_node = cp_node.appendChild(
          xmlDoc.createElement("cartaporte31:FiguraTransporte")
        );
        this.#tipoFigura.forEach((item) => {
          const tipoFigura_node = figTransporte_node.appendChild(
            xmlDoc.createElement("cartaporte31:TiposFigura")
          );
          Object.keys(item).forEach((key) => {
            const typedKey = key as keyof tipoFiguraInterface;
            const value = item[typedKey];
            if (value !== undefined) {
              if (key !== "Domicilio" && key !== "PartesTransporte") {
                tipoFigura_node.setAttribute(key, value.toString());
              }
            }
          });
          item.PartesTransporte?.forEach((pt) => {
            const partesTransporte_node = tipoFigura_node.appendChild(
              xmlDoc.createElement("cartaporte31:PartesTransporte")
            );
            partesTransporte_node.setAttribute(
              "ParteTransporte",
              pt.ParteTransporte
            );
          });
          if (item.Domicilio) {
            const domTipoFigura = tipoFigura_node.appendChild(
              xmlDoc.createElement("cartaporte31:Domicilio")
            );
            Object.keys(item.Domicilio).forEach((key) => {
              const typedKey = key as keyof domicilioInterface;
              const value = item.Domicilio![typedKey];
              if (value !== undefined) {
                domTipoFigura.setAttribute(key, value.toString());
              }
            });
          }
        });

        const serializer = new XMLSerializer();
        const xmlCartaPorte = pd.xml(serializer.serializeToString(xmlDoc));
        const selloCadenaOriginal = await this.#generarCadenaOrigen(
          xmlCartaPorte
        );
        // Encontrar el elemento cfdi:Comprobante y agregar el atributo sello
        const comprobanteElement =
          xmlDoc.getElementsByTagName("cfdi:Comprobante")[0];
        if (comprobanteElement) {
          comprobanteElement.setAttribute("Sello", selloCadenaOriginal);
        }
        return serializer.serializeToString(xmlDoc);
      } else {
        return {
          status: false,
          data: null,
          message: "Este XML ya ha sido timbrado.",
        };
      }
    } else {
      return {
        status: false,
        data: null,
        message: "No ha proporcionado el XML",
      };
    }
  }
}
