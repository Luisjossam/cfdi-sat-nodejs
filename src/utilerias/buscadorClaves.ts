import fs from "fs";
import path from "path";
import {
  usoCfdiInterface,
  regimenFiscalInterface,
  tipoRelacionInterface,
} from "../interfaces/facturaInterfaces";
const basePath = path.resolve(__dirname, "..", "resources", "catalogos");
export function buscarUsoCFDI(value: string): usoCfdiInterface | undefined {
  try {
    const json_file = path.join(basePath, "cat_uso_cfdi.json");
    const cfdisData = fs.readFileSync(json_file, "utf8");
    const cfdis: usoCfdiInterface[] = JSON.parse(cfdisData);
    return cfdis.find((item) => item.clave === value);
  } catch (error) {
    throw error;
  }
}
export function buscarRegimenFiscal(
  value: string
): regimenFiscalInterface | undefined {
  try {
    const json_file = path.join(basePath, "cat_regimen_fiscal.json");
    const data = fs.readFileSync(json_file, "utf8");
    const data_parser: regimenFiscalInterface[] = JSON.parse(data);
    return data_parser.find((item) => item.clave === value);
  } catch (error) {
    throw error;
  }
}
export function buscarTipoRelacion(
  value: string
): tipoRelacionInterface | undefined {
  try {
    const json_file = path.join(basePath, "cat_tipo_relacion.json");
    const data = fs.readFileSync(json_file, "utf8");
    const data_parser: tipoRelacionInterface[] = JSON.parse(data);
    return data_parser.find((item) => item.clave === value);
  } catch (error) {
    throw error;
  }
}
export function buscarFormaPago(
  value: string
): tipoRelacionInterface | undefined {
  try {
    const json_file = path.join(basePath, "cat_forma_pago.json");
    const data = fs.readFileSync(json_file, "utf8");
    const data_parser: tipoRelacionInterface[] = JSON.parse(data);
    return data_parser.find((item) => item.clave === value);
  } catch (error) {
    throw error;
  }
}
export function buscarMetodoPago(
  value: string
): tipoRelacionInterface | undefined {
  try {
    const json_file = path.join(basePath, "cat_metodo_pago.json");
    const data = fs.readFileSync(json_file, "utf8");
    const data_parser: tipoRelacionInterface[] = JSON.parse(data);
    return data_parser.find((item) => item.clave === value);
  } catch (error) {
    throw error;
  }
}
export function buscarMeses(value: string): tipoRelacionInterface | undefined {
  try {
    const json_file = path.join(basePath, "cat_meses.json");
    const data = fs.readFileSync(json_file, "utf8");
    const data_parser: tipoRelacionInterface[] = JSON.parse(data);
    return data_parser.find((item) => item.clave === value);
  } catch (error) {
    throw error;
  }
}
export function buscarPeriodicidad(
  value: string
): tipoRelacionInterface | undefined {
  try {
    const json_file = path.join(basePath, "cat_periodicidad.json");
    const data = fs.readFileSync(json_file, "utf8");
    const data_parser: tipoRelacionInterface[] = JSON.parse(data);
    return data_parser.find((item) => item.clave === value);
  } catch (error) {
    throw error;
  }
}
