const fs = require("fs");
function validateCer(cer: string) {
  if (!fs.existsSync(cer)) {
    throw new Error("No existe el certificado en la ruta especificada.");
  }
  if (!cer.includes(".cer")) {
    throw new Error("El fichero no es un certificado.");
  }
}
function validateKey(key: string, password: string) {
  if (!fs.existsSync(key)) {
    throw new Error("No existe la llave privada en la ruta especificada.");
  }
  if (!key.includes(".key")) {
    throw new Error("El fichero no es una llave privada.");
  }
  if (password === "") {
    throw new Error("No se proporciono una contraseña.");
  }
}
module.exports = { validateCer, validateKey };
