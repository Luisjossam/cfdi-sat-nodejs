import {
  facturaInterface,
  atributosInterface,
  atributosConceptoInterface,
} from "./interfaces/facturaInterfaces";
const fs = require("fs");
const forge = require("node-forge");
import { CFDIIngreso } from "./clases/ingreso";
import { create } from "xmlbuilder2";
const pki = forge.pki;
export class FacturaCFDI implements facturaInterface {
  emisorXml: string;
  receptorXml: string;
  noCertificado: string;
  certificado: string;
  emisor: { Rfc: string; Nombre: string; RegimenFiscal: string };
  receptor: {
    Rfc: string;
    Nombre: string;
    RegimenFiscal: string;
    DomicilioFiscalReceptor: number | string;
    RegimenFiscalReceptor: number | string;
    UsoCFDI: string;
  };
  conceptos: atributosConceptoInterface[];
  constructor() {
    this.emisorXml = "";
    this.receptorXml = "";
    this.noCertificado = "";
    this.certificado = "";
    this.emisor = { Rfc: "", Nombre: "", RegimenFiscal: "" };
    this.receptor = {
      Rfc: "",
      Nombre: "",
      RegimenFiscal: "",
      DomicilioFiscalReceptor: "",
      RegimenFiscalReceptor: "",
      UsoCFDI: "",
    };
    this.conceptos = [
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
  certificarCFDI(certificado: any) {
    const cer = fs.readFileSync(certificado, "base64");
    const pem =
      "-----BEGIN CERTIFICATE-----\n" + cer + "\n-----END CERTIFICATE-----";
    const cerNumber = pki
      .certificateFromPem(pem)
      .serialNumber.match(/.{1,2}/g)
      .map(function (v: any) {
        return String.fromCharCode(parseInt(v, 16));
      })
      .join("");

    this.certificado = cer;
    this.noCertificado = cerNumber;
  }
  crearEmisor(
    rfcEmisor: string,
    nombreEmisor: string,
    regimenFiscalEmisor: string
  ) {
    this.emisor.Rfc = rfcEmisor;
    this.emisor.Nombre = nombreEmisor;
    this.emisor.RegimenFiscal = regimenFiscalEmisor;
  }
  crearReceptor(
    rfcReceptor: string,
    nombreReceptor: string,
    codigoPostalReceptor: number,
    regimenFiscalReceptor: number,
    usoCfdi: string
  ) {
    this.receptor.Rfc = rfcReceptor;
    this.receptor.Nombre = nombreReceptor;
    this.receptor.DomicilioFiscalReceptor = codigoPostalReceptor;
    this.receptor.RegimenFiscalReceptor = regimenFiscalReceptor;
    this.receptor.UsoCFDI = usoCfdi;
  }
  crearConceptos(conceptos: atributosConceptoInterface[]) {
    this.conceptos = conceptos;
  }
  generarXml(atributos: atributosInterface) {
    const xml = new CFDIIngreso(
      atributos,
      { ...this.emisor },
      { ...this.receptor },
      this.certificado,
      this.noCertificado,
      this.conceptos
    );
    return xml.crearXMl();
  }
  generarXmlSellado(atributos: atributosInterface) {
    const xml = new CFDIIngreso(
      atributos,
      { ...this.emisor },
      { ...this.receptor },
      this.certificado,
      this.noCertificado,
      this.conceptos
    );
    return xml.crearXMl(true);
  }
}
