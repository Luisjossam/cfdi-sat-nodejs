export function numberToWords(number: string) {
  let numberText = "";
  let value: number = Math.floor(parseFloat(number));
  if (value === 0) numberText = "CERO";
  else if (value === 1) numberText = "UNO";
  else if (value === 2) numberText = "DOS";
  else if (value === 3) numberText = "TRES";
  else if (value === 4) numberText = "CUATRO";
  else if (value === 5) numberText = "CINCO";
  else if (value === 6) numberText = "SEIS";
  else if (value === 7) numberText = "SIETE";
  else if (value === 8) numberText = "OCHO";
  else if (value === 9) numberText = "NUEVE";
  else if (value === 10) numberText = "DIEZ";
  else if (value === 11) numberText = "ONCE";
  else if (value === 12) numberText = "DOCE";
  else if (value === 13) numberText = "TRECE";
  else if (value === 14) numberText = "CATORCE";
  else if (value === 15) numberText = "QUINCE";
  else if (value < 20)
    numberText = "DIECI" + numberToWords((Math.floor(value) - 10).toString());
  else if (value === 20) numberText = "VEINTE";
  else if (value < 30)
    numberText = "VEINTI" + numberToWords((Math.floor(value) - 20).toString());
  else if (value === 30) numberText = "TREINTA";
  else if (value === 40) numberText = "CUARENTA";
  else if (value === 50) numberText = "CINCUENTA";
  else if (value === 60) numberText = "SESENTA";
  else if (value === 70) numberText = "SETENTA";
  else if (value === 80) numberText = "OCHENTA";
  else if (value === 90) numberText = "NOVENTA";
  else if (value < 100)
    numberText =
      numberToWords((Math.floor(value / 10) * 10).toString()) +
      " Y " +
      numberToWords((Math.floor(value) % 10).toString());
  else if (value === 100) numberText = "CIEN";
  else if (value < 200)
    numberText =
      "CIENTO " + numberToWords((Math.floor(value) - 100).toString());
  else if (
    value === 200 ||
    value === 300 ||
    value === 400 ||
    value === 600 ||
    value === 800
  )
    numberText = numberToWords(Math.floor(value / 100).toString()) + "CIENTOS";
  else if (value === 500) numberText = "QUINIENTOS";
  else if (value === 700) numberText = "SETECIENTOS";
  else if (value === 900) numberText = "NOVECIENTOS";
  else if (value < 1000)
    numberText =
      numberToWords((Math.floor(value / 100) * 100).toString()) +
      " " +
      numberToWords((Math.floor(value) % 100).toString());
  else if (value == 1000) numberText = "MIL";
  else if (value < 2000)
    numberText = "MIL " + numberToWords((Math.floor(value) % 1000).toString());
  else if (value < 1000000) {
    numberText = numberToWords((Math.floor(value) / 1000).toString()) + " MIL";
    if (value % 1000 > 0)
      numberText =
        numberText + " " + numberToWords((Math.floor(value) % 1000).toString());
  } else if (value == 1000000) numberText = "UN MILLON";
  else if (value < 2000000)
    numberText =
      "UN MILLON " + numberToWords((Math.floor(value) % 1000000).toString());
  else if (value < 1000000000000) {
    numberText =
      numberToWords(Math.floor(value / 1000000).toString()) + " MILLONES ";
    if (value - Math.floor(value / 1000000) * 1000000 > 0)
      numberText =
        numberText +
        " " +
        numberToWords(
          (Math.floor(value) - Math.floor(value / 1000000) * 1000000).toString()
        );
  } else if (value == 1000000000000) numberText = "UN BILLON";
  else if (value < 2000000000000)
    numberText =
      "UN BILLON " +
      numberToWords(
        (
          Math.floor(value) -
          Math.floor(value / 1000000000000) * 1000000000000
        ).toString()
      );
  else {
    numberText =
      numberToWords(Math.floor(value / 1000000000000).toString()) + " BILLONES";
    if (value - Math.floor(value / 1000000000000) * 1000000000000 > 0)
      numberText =
        numberText +
        " " +
        numberToWords(
          (
            Math.floor(value) -
            Math.floor(value / 1000000000000) * 1000000000000
          ).toString()
        );
  }
  //return `${numberText} PESOS ${decimalNumber.toString()}/100 M.N.`;
  return numberText;
}
