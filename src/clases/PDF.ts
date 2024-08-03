import {
  PDFInterface,
  cfdiJsonInterface,
  cfdiConceptosInterface,
  cfdiRelacionados,
} from "../interfaces/facturaInterfaces";
import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import puppeteer from "puppeteer";
import { DOMParser } from "@xmldom/xmldom";
import * as xpath from "xpath";
import { numberToWords } from "../utilerias/utils";
import QRCode from "qrcode";
import {
  buscarUsoCFDI,
  buscarRegimenFiscal,
  buscarTipoRelacion,
  buscarFormaPago,
  buscarMetodoPago,
  buscarMeses,
  buscarPeriodicidad,
} from "../utilerias/buscadorClaves";
interface JsonObject {
  [key: string]: any;
}
export default class PDF implements PDFInterface {
  Xml: string;
  CadenaOriginal: string;
  Path?: string | undefined;
  Observaciones?: string | undefined;
  Logo?: string | undefined;
  constructor(params: PDFInterface) {
    this.Xml = params.Xml;
    this.CadenaOriginal = params.CadenaOriginal;
    this.Path = params.Path;
    this.Observaciones = params.Observaciones;
    this.Logo = params.Logo;
  }
  getTemplate(type: string) {
    try {
      const basePath = path.resolve(__dirname, "..", "resources", "templates");
      let template = path.join(basePath, `${type}_Pdf.html`);
      if (this.Path) {
        if (!fs.existsSync(this.Path)) {
          throw new Error(
            "La plantilla PDF no existe o no fue encontrada en la ruta dada."
          );
        }
        template = this.Path;
      }
      return fs.readFileSync(template, "utf-8");
    } catch (error) {
      throw error;
    }
  }
  convertXMlToJson(xml: string): cfdiJsonInterface | null {
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    const nodes = xpath.select("/*", doc) as Node[];
    if (nodes.length > 0) {
      return JSON.stringify(this.nodeToJson(nodes[0])) as cfdiJsonInterface;
    }
    return null;
  }
  nodeToJson(node: Node): JsonObject | string {
    const obj: JsonObject = {};

    if (node.nodeType === 1) {
      const element = node as Element;
      if (element.attributes.length > 0) {
        obj["@attributes"] = {};
        for (let j = 0; j < element.attributes.length; j++) {
          const attribute = element.attributes.item(j);
          if (attribute) {
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
          }
        }
      }
    } else if (node.nodeType === 3) {
      const value = node.nodeValue?.trim();
      if (value) {
        return value;
      }
    }

    // Recorre los hijos del nodo
    if (node.hasChildNodes()) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes.item(i);
        if (child) {
          const nodeName = child.nodeName;
          if (typeof obj[nodeName] === "undefined") {
            obj[nodeName] = this.nodeToJson(child);
          } else {
            if (!Array.isArray(obj[nodeName])) {
              const old = obj[nodeName];
              obj[nodeName] = [];
              obj[nodeName].push(old);
            }
            obj[nodeName].push(this.nodeToJson(child));
          }
        }
      }
    }
    return obj;
  }
  async createIngresoPDF() {
    try {
      const getTemplate = this.getTemplate("Ingreso");
      let json_data: cfdiJsonInterface | null = this.convertXMlToJson(this.Xml);
      if (json_data) {
        json_data = JSON.parse(json_data.toString());
      }

      const data_fiscal = json_data!["@attributes"];
      const emisor = json_data!["cfdi:Emisor"]!["@attributes"];
      const receptor = json_data!["cfdi:Receptor"]!["@attributes"];
      const detailsCrudo = json_data!["cfdi:Conceptos"]!["cfdi:Concepto"];
      const details = [].concat(detailsCrudo);
      const impuestos = json_data!["cfdi:Impuestos"]!["@attributes"];
      const complemento =
        json_data!["cfdi:Complemento"]!["tfd:TimbreFiscalDigital"]![
          "@attributes"
        ];
      const cfdiR: cfdiRelacionados | undefined =
        json_data!["cfdi:CfdiRelacionados"];
      const cfdiRelacionados: cfdiRelacionados[] = cfdiR
        ? [].concat(cfdiR as any)
        : [];
      let heightCFDIRelacionados = 0;
      if (cfdiRelacionados.length > 0) {
        cfdiRelacionados.forEach((item: any) => {
          const relaciones = [].concat(item["cfdi:CfdiRelacionado"]);
          heightCFDIRelacionados += relaciones.length * 10;
        });
      }
      const facturaGlobal = json_data!["cfdi:InformacionGlobal"];
      let varFacturaGlobal = "";
      if (facturaGlobal) {
        const periocidad = buscarPeriodicidad(
          facturaGlobal["@attributes"].Periodicidad
        );
        const meses = buscarMeses(facturaGlobal["@attributes"].Meses);
        varFacturaGlobal = `${facturaGlobal["@attributes"].Periodicidad} ${periocidad?.descripcion} | ${facturaGlobal["@attributes"].Meses} ${meses?.descripcion} | ${facturaGlobal["@attributes"].Año}`;
      }
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      const pdfBuffers = [];
      const maxHeightHeaders = 240; // Altura maxima de encabezados
      const maxHeightTotals = 158; // Altura maxima de los totales
      const maxHeight = parseFloat("633.6"); // Altura máxima de la tabla en px
      const maxHeightPage = 960; // Altura maxima de la pagina
      const baseItemHeight = parseFloat("17.28"); // Altura base de cada item en px

      let remainingDetails = [...details]; // Altura máxima en px por página
      const usoCfdiReceptor = buscarUsoCFDI(receptor.UsoCFDI);
      const regimenFReceptor = buscarRegimenFiscal(
        receptor.RegimenFiscalReceptor
      );
      const regimentFEmisor = buscarRegimenFiscal(emisor.RegimenFiscal);
      const formaPago = buscarFormaPago(data_fiscal!.FormaPago);
      const metodoPago = buscarMetodoPago(data_fiscal!.MetodoPago);
      while (remainingDetails.length > 0) {
        let currentPageData = [];
        let currentHeight = 0;

        // Determinar cuántos items caben en la página actual
        while (remainingDetails.length > 0) {
          const item = remainingDetails[0];
          let itemHeight = parseFloat("17.28");
          if (item["cfdi:Impuestos"]) {
            if (item["cfdi:Impuestos"]["cfdi:Traslados"]) {
              const traslados =
                item["cfdi:Impuestos"]["cfdi:Traslados"]["cfdi:Traslado"];
              const trasladoArray = [].concat(traslados);
              itemHeight += trasladoArray.length * baseItemHeight;
            }
            if (item["cfdi:Impuestos"]["cfdi:Retenciones"]) {
              const retenciones =
                item["cfdi:Impuestos"]["cfdi:Retenciones"]["cfdi:Retencion"];
              const retencionesArray = [].concat(retenciones);
              itemHeight += retencionesArray.length * baseItemHeight;
            }
          }

          if (currentHeight + itemHeight > maxHeight) {
            break; // La altura máxima se ha alcanzado, salir del bucle
          }
          const subtractHeight =
            maxHeightPage -
            (currentHeight +
              itemHeight +
              maxHeightHeaders +
              maxHeightTotals +
              heightCFDIRelacionados);
          if (remainingDetails.length <= 1 && 190 > subtractHeight) {
            break;
          }
          // Agregar el item a la página actual
          currentPageData.push(remainingDetails.shift());
          currentHeight += itemHeight;
        }
        const getDiscount = data_fiscal!.Descuento
          ? data_fiscal!.Descuento
          : "0";
        const getImpuestos = impuestos.TotalImpuestosTrasladados
          ? impuestos.TotalImpuestosTrasladados
          : "0";
        const getRetenciones = impuestos.TotalImpuestosRetenidos
          ? impuestos.TotalImpuestosRetenidos
          : "0";
        const condicionesPago = data_fiscal!.CondicionesPago
          ? data_fiscal!.CondicionesPago
          : "";
        const total =
          parseFloat(data_fiscal!.SubTotal) -
          parseFloat(getDiscount) -
          parseFloat(getRetenciones) +
          parseFloat(getImpuestos);
        const decimalValue = (total - Math.floor(total)) * 100;
        let currentPageHtml = getTemplate
          .replace("__logo__", `data:image/png;base64,${this.Logo}`)
          .replace(/__NombreEmisor__/g, emisor.Nombre)
          .replace("__RFCEmisor__", emisor.Rfc)
          .replace(
            "__RegimenFiscalEmisor__",
            `${emisor.RegimenFiscal} - ${regimentFEmisor?.descripcion}`
          )
          .replace("__SerieComprobante__", data_fiscal!.Serie)
          .replace("__FolioComprobante__", data_fiscal!.Folio)
          .replace("__FechaComprobante__", data_fiscal!.Fecha)
          .replace(
            "__LugarExpedicionComprobante__",
            data_fiscal!.LugarExpedicion
          )
          .replace("__UUIDComprobante__", complemento.UUID)
          .replace("__NoCertificadoEmisor__", data_fiscal!.NoCertificado)
          .replace(/__NombreReceptor__/g, receptor.Nombre)
          .replace("__RFCReceptor__", receptor.Rfc)
          .replace(
            "__DomicilioFiscalReceptor__",
            receptor.DomicilioFiscalReceptor
          )
          .replace(
            "__RegimenFiscalReceptor__",
            `${receptor.RegimenFiscalReceptor} - ${regimenFReceptor?.descripcion}`
          )
          .replace(
            "__UsoCFDIReceptor__",
            `${receptor.UsoCFDI} - ${usoCfdiReceptor?.descripcion}`
          )
          .replace(
            "__TablaConceptos__",
            this.createTableCFDIIngreso(currentPageData)
          )
          .replace(
            "__SubtotalComprobante__",
            parseFloat(data_fiscal!.SubTotal).toFixed(2)
          )
          .replace(
            "__DescuentoComprobante__",
            parseFloat(getDiscount).toFixed(2)
          )
          .replace("__ImpuestosComprobante__", getImpuestos)
          .replace("__TotalComprobante__", total.toFixed(2));
        // Solo agregar el sello en la última página
        if (remainingDetails.length === 0) {
          currentPageHtml = currentPageHtml
            .replace(
              "__CadenaOriginalComprobante__",
              this.createViewCadenaOriginal(this.CadenaOriginal)
            )
            .replace(
              "__QRCodeSellosComprobante__",
              await this.createViewQRCodeSellos(
                complemento.UUID,
                emisor.Rfc,
                receptor.Rfc,
                data_fiscal!.Total,
                complemento.SelloCFD,
                complemento.SelloSAT
              )
            )
            .replace(
              "__CFDIRelacionadosComprobante__",
              ` <span style="font-weight: 600">CFDI Relacionados: </span> <span>${this.setCfdiRelacionados(
                cfdiRelacionados
              )}</span>`
            )
            .replace(
              "__FormaPagoComprobante__",
              `<span style="font-weight: 600">Forma de pago: </span><span>${
                data_fiscal!.FormaPago
              } - ${formaPago?.descripcion}</span>`
            )
            .replace(
              "__MetodoPagoComprobante__",
              `<span style="font-weight: 600">Método de pago: </span><span>${
                data_fiscal!.MetodoPago
              } - ${metodoPago?.descripcion}</span>`
            )
            .replace(
              "__CondicionesPagoComprobante__",
              `<span style="font-weight: 600">Condiciones de pago: </span><span>${condicionesPago}</span>`
            )
            .replace(
              "__NoCertificadoSAT__",
              `<span style="font-weight: 600">No. Certificado SAT: </span><span>${complemento.NoCertificadoSAT}</span>`
            )
            .replace(
              "__FechaTimbradoComprobante__",
              `<span style="font-weight: 600">Fecha de certificación: </span><span>${complemento.FechaTimbrado}</span>`
            )
            .replace(
              "__FacturaGlobalComprobante__",
              `<span style="font-weight: 600">Factura global: </span><span>${varFacturaGlobal}</span>`
            )
            .replace(
              "__TotalLetraComprobante__",
              `<span style="font-weight: 600">Total con letra: </span><span>${numberToWords(
                total.toFixed(2)
              )} PESOS ${parseInt(decimalValue.toString())}/100 M.N</span>`
            );
        } else {
          currentPageHtml = currentPageHtml
            .replace("__CadenaOriginalComprobante__", "")
            .replace("__QRCodeSellosComprobante__", "")
            .replace("__CFDIRelacionadosComprobante__", "")
            .replace("__FormaPagoComprobante__", "")
            .replace("__MetodoPagoComprobante__", "")
            .replace("__CondicionesPagoComprobante__", "")
            .replace("__NoCertificadoSAT__", "")
            .replace("__FechaTimbradoComprobante__", "")
            .replace("__FacturaGlobalComprobante__", "")
            .replace("__TotalLetraComprobante__", "");
        }
        await page.setContent(currentPageHtml);
        // Generar el PDF de la página actual y almacenarlo en el array de buffers
        const pdfBuffer = await page.pdf({ format: "letter" });
        pdfBuffers.push(pdfBuffer);
      }
      // Cerrar el navegador
      await browser.close();
      // Unir los pdf's en uno solo
      const mergedPdf = await PDFDocument.create();
      for (const pdfBuffer of pdfBuffers) {
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdfDoc,
          pdfDoc.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdf = await mergedPdf.save();

      const pdfWithPageNumbers = await this.addPageNumbers(mergedPdf);

      return pdfWithPageNumbers;
    } catch (error) {
      throw error;
    }
  }
  async addPageNumbers(pdfDoc: PDFDocument) {
    const totalPages = pdfDoc.getPageCount();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (let i = 0; i < totalPages; i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();
      const fontSize = 9;
      const text = `Página ${i + 1} de ${totalPages}`;
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      page.drawText(text, {
        x: width - textWidth - 40,
        y: 25,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }

    return await pdfDoc.save();
  }
  createViewCadenaOriginal(data: string): string {
    let seccionHTML = `
        <div  style="position: relative;left: 0.5in; width: 7.42in;" >
            <div style="border: 2px solid #bdbdbd; border-radius: 10px;">
                <div style="font-size: 12px;background-color:#bdbdbd;padding:2px;">Cadena Original del Complemento de Certificación Digital del SAT</div>
                <div style="word-break: break-all;font-size:10px">${data}</div>
            </div>
        </div>
    `;
    return seccionHTML;
  }
  async createViewQRCodeSellos(
    uuid: string,
    rfcEmisor: string,
    rfcReceptor: string,
    total: string,
    selloDEmisor: string,
    selloDSAT: string
  ): Promise<string> {
    const qrCode = await this.createQRCode(
      uuid,
      rfcEmisor,
      rfcReceptor,
      total,
      selloDEmisor
    );
    const seccionHTML = `
        <div  style="position: relative;left: 0.5in; width: 7.42in;display:flex;margin-top:10px;items-align:center">
                <div>
                    <img src="${qrCode}" alt="QR Code" style="width:1.55in;height:1.55in">
                </div>
                <div style="margin-left:0.05in;width:5.87in;">
                    <div style="border: 2px solid #bdbdbd; border-radius: 10px;width:5.80">
                        <div style="font-size: 12px;background-color:#bdbdbd;padding:2px">Sello digital del CFDI</div>
                        <div style="word-break: break-all;font-size:10px">${selloDEmisor}</div>
                    </div>
                    <div style="border: 2px solid #bdbdbd; border-radius: 10px;width:5.80;margin-top:10px">
                        <div style="font-size: 12px;background-color:#bdbdbd;padding:2px;">Sello digital del SAT</div>
                        <div style="word-break: break-all;font-size:10px">${selloDSAT}</div>
                    </div>
                </div>
        </div>
        `;
    return seccionHTML;
  }
  async createQRCode(
    uuid: string,
    rfcEmisor: string,
    rfcReceptor: string,
    total: string,
    selloDEmisor: string
  ): Promise<string> {
    const ochoDigitos = selloDEmisor.slice(-8);
    const link = `https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx?id=${uuid}&re=${rfcEmisor}&rr=${rfcReceptor}&tt=${total}&fe=${ochoDigitos}`;
    const qrCode = await QRCode.toDataURL(link);
    return qrCode;
  }
  createTableCFDIIngreso(data: any) {
    let tableHTML = "";

    // Encabezado de la tabla
    tableHTML += `
        <div style="width: 100%;">
            <div style="background-color: #bdbdbd;  display: grid;grid-template-columns: repeat(20, minmax(0, 1fr));">
                <div style="grid-column: span 3 / span 3;font-size: 12px !important;align-items: center;text-align: center;padding-top:2px;padding-bottom:2px;">Código</div>
                <div style="grid-column: span 2 / span 2;font-size: 12px !important;align-items: center;text-align: center;padding-top:2px;padding-bottom:2px;">Clave ud.</div>
                <div style="grid-column: span 2 / span 2;font-size: 12px !important;align-items: center;text-align: center;padding-top:2px;padding-bottom:2px;">Clave Prod/Serv</div>
                <div style="grid-column: span 5 / span 5;font-size: 12px !important;align-items: center;text-align: center;padding-top:2px;padding-bottom:2px;">Descripción</div>
                <div style="grid-column: span 2 / span 2;font-size: 12px !important;align-items: center;text-align: center;padding-top:2px;padding-bottom:2px;">Cant.</div>
                <div style="grid-column: span 2 / span 2;font-size: 12px !important;align-items: center;text-align: center;padding-top:2px;padding-bottom:2px;">Precio</div>
                <div style="grid-column: span 2 / span 2;font-size: 12px !important;align-items: center;text-align: center;padding-top:2px;padding-bottom:2px;">Desc.</div>
                <div style="grid-column: span 2 / span 2;font-size: 12px !important;align-items: center;text-align: center;padding-top:2px;padding-bottom:2px;">Importe</div>
            </div>
    `;
    data.forEach((item: any, index: number) => {
      tableHTML += `
            <div id="registerID${index}" style="display: grid;grid-template-columns: repeat(20, minmax(0, 1fr));">
                <div style="grid-column: span 3 / span 3;font-size: 12px !important;align-items: center;padding:2px;white-space: nowrap;overflow:hidden;">
                    ${
                      item["@attributes"].NoIdentificacion
                        ? item["@attributes"].NoIdentificacion
                        : ""
                    }
                </div>
                <div style="grid-column: span 2 / span 2;font-size: 12px !important;align-items: center;padding:2px;white-space: nowrap;overflow:hidden;">
                    ${item["@attributes"].ClaveUnidad}
                </div>
                <div style="grid-column: span 2 / span 2;font-size: 12px !important;align-items: center;padding:2px;white-space: nowrap;overflow:hidden;">
                    ${item["@attributes"].ClaveProdServ}
                </div>
                <div style="grid-column: span 5 / span 5;font-size: 12px !important;align-items: center;padding:2px;white-space: nowrap;overflow:hidden;">
                    ${item["@attributes"].Descripcion}
                </div>
                <div style="grid-column: span 2 / span 2;font-size: 12px !important;align-items: center;padding:2px;text-align: right;white-space: nowrap;overflow:hidden;">
                    ${parseFloat(item["@attributes"].Cantidad)
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
                <div style="grid-column: span 2 / span 2;font-size: 12px !important;align-items: center;padding:2px;text-align: right;white-space: nowrap;overflow:hidden;">
                    ${parseFloat(item["@attributes"].ValorUnitario)
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
                <div style="grid-column: span 2 / span 2;font-size: 12px !important;align-items: center;padding:2px;text-align: right;white-space: nowrap;overflow:hidden;">
                    ${
                      item["@attributes"].Descuento
                        ? parseFloat(item["@attributes"].Descuento)
                            .toFixed(2)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : "0.00"
                    }
                </div>
                <div style="grid-column: span 2 / span 2;font-size: 12px !important;align-items: center;padding:2px;text-align: right;white-space: nowrap;overflow:hidden;">
                    ${parseFloat(item["@attributes"].Importe)
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
            </div>
        `;
      if (item["cfdi:Impuestos"]) {
        if (item["cfdi:Impuestos"]["cfdi:Traslados"]) {
          const traslados =
            item["cfdi:Impuestos"]["cfdi:Traslados"]["cfdi:Traslado"];
          const trasladoArray = [].concat(traslados);
          trasladoArray.forEach((impuesto: any) => {
            tableHTML += `
                      <div style="font-size: 9px !important;align-items: center;white-space: nowrap;overflow:hidden;display: grid;grid-template-columns: repeat(16, minmax(0, 1fr));">
                      <div style="grid-column: span 1 / span 1;align-items: center;padding:2px;white-space: nowrap;overflow:hidden;">
                              
                          </div>
                        <div style="grid-column: span 2 / span 2;align-items: center;padding:2px;white-space: nowrap;overflow:hidden;">
                              Traslado
                          </div>
                          <div style="grid-column: span 2 / span 2;align-items: center;padding:2px;white-space: nowrap;overflow:hidden;">
                              Imp: ${impuesto["@attributes"].Impuesto}
                          </div>
                          <div style="grid-column: span 2 / span 2;align-items: center;padding:2px;white-space: nowrap;overflow:hidden;">
                              Base: ${parseFloat(impuesto["@attributes"].Base)
                                .toFixed(2)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </div>
                          <div style="grid-column: span 3 / span 3;align-items: center;padding:2px;white-space: nowrap;overflow:hidden;">
                              Tipo Factor: ${impuesto["@attributes"].TipoFactor}
                          </div>
                          <div style="grid-column: span 3 / span 3;align-items: center;padding:2px;white-space: nowrap;overflow:hidden;">
                              ${impuesto["@attributes"].TipoFactor}: ${
              impuesto["@attributes"].TipoFactor === "Exento"
                ? ""
                : impuesto["@attributes"].TasaOCuota
            }
                                                ${
                                                  impuesto["@attributes"]
                                                    .TipoFactor === "Tasa"
                                                    ? "%"
                                                    : "$"
                                                }
                          </div>
                          <div style="grid-column: span 3 / span 3;align-items: center;padding:2px;white-space: nowrap;overflow:hidden;">
                                ${
                                  impuesto["@attributes"].TipoFactor ===
                                  "Exento"
                                    ? ""
                                    : "Importe: "
                                }${
              impuesto["@attributes"].TipoFactor === "Exento"
                ? ""
                : parseFloat(impuesto["@attributes"].Importe)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
                          </div>
                      </div>       
                  `;
          });
        }
        if (item["cfdi:Impuestos"]["cfdi:Retenciones"]) {
          const retenciones =
            item["cfdi:Impuestos"]["cfdi:Retenciones"]["cfdi:Retencion"];
          const retencionesArray = [].concat(retenciones);
          retencionesArray.forEach((retencion: any) => {
            tableHTML += `
                <div style="font-size: 9px !important;align-items: center;white-space: nowrap;overflow:hidden;display: grid;grid-template-columns: repeat(16, minmax(0, 1fr));">
                    <div style="grid-column: span 1 / span 1;align-items: center;padding:2px;white-space: nowrap;overflow:hidden;"></div>
                    <div style="grid-column: span 2 / span 2;align-items: center;padding:2px;white-space: nowrap;overflow:hidden;">
                        Retención
                    </div>
                    <div style="grid-column: span 2 / span 2;align-items: center;padding:2px;white-space: nowrap;overflow:hidden;">
                        Imp: ${retencion["@attributes"].Impuesto}
                    </div>
                    <div style="grid-column: span 2 / span 2;align-items: center;padding:2px;white-space: nowrap;overflow:hidden;">
                        Base: ${parseFloat(retencion["@attributes"].Base)
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </div>
                    <div style="grid-column: span 3 / span 3;align-items: center;padding:2px;white-space: nowrap;overflow:hidden;">
                              Tipo Factor: ${
                                retencion["@attributes"].TipoFactor
                              }
                          </div>
                          <div style="grid-column: span 3 / span 3;align-items: center;padding:2px;white-space: nowrap;overflow:hidden;">
                              ${retencion["@attributes"].TipoFactor}: ${
              retencion["@attributes"].TipoFactor === "Exento"
                ? ""
                : retencion["@attributes"].TasaOCuota
            }
                                ${
                                  retencion["@attributes"].TipoFactor === "Tasa"
                                    ? "%"
                                    : "$"
                                }
                          </div>
                          <div style="grid-column: span 3 / span 3;align-items: center;padding:2px;white-space: nowrap;overflow:hidden;">
                                ${
                                  retencion["@attributes"].TipoFactor ===
                                  "Exento"
                                    ? ""
                                    : "Importe: "
                                }${
              retencion["@attributes"].TipoFactor === "Exento"
                ? ""
                : parseFloat(retencion["@attributes"].Importe)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
                          </div>
                </div>
            `;
          });
        }
      }
    });
    tableHTML += "</div>";
    return tableHTML;
  }
  setCfdiRelacionados(data: any) {
    let seccionHTML = "";
    data.forEach((item: any) => {
      const TipoRelacionText = buscarTipoRelacion(
        item["@attributes"].TipoRelacion
      );
      const relaciones = [].concat(item["cfdi:CfdiRelacionado"]);
      relaciones.forEach((r: any) => {
        seccionHTML += `<div><span>${item["@attributes"].TipoRelacion} ${TipoRelacionText?.descripcion} - </span><span>${r["@attributes"].UUID}</span></div>`;
      });
    });
    return seccionHTML;
  }
}
