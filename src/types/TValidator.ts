export type TNComprobanteFechaErrorOutput = "CSN400010" | "CSN400011" | "CSN400012" | "CSN400013" | "CSN400014" | "CSN400015";
export type TNSerieErrorOutput = "CSN400020" | "CSN400021" | "CSN400022" | "CSN400023";
export type TNFolioErrorOutput = "CSN400030" | "CSN400031" | "CSN400032" | "CSN400033";
export type TNMetodoPagoOutput = "CSN400040" | "CSN400041" | "CSN400042" | "CSN400043" | "CSN400044";
export type TNFormaPagoErrorOutput = "CSN400050" | "CSN400051" | "CSN400052" | "CSN400053" | "CSN400054" | "CSN400055";
export type TNSubtotalErrorOutput = "CSN400060" | "CSN400061" | "CSN400062" | "CSN400063";
export type TNDescuentoErrorOutput = "CSN400070" | "CSN400071" | "CSN400072" | "CSN400073" | "CSN400074";
export type TNTotalErrorOutput = "CSN400080" | "CSN400081" | "CSN400082" | "CSN400083" | "CSN400084";
export type TNMonedaErrorOutput = "CSN400090" | "CSN400091" | "CSN400092";
export type TNTipoCambioErrorOutput = "CSN400100" | "CSN400101" | "CSN400102" | "CSN400103" | "CSN400104";
export type TNExportacionErrorOuput = "CSN400110" | "CSN400111" | "CSN400112";
export type TNCondicionesPagoErrorOutput = "CSN400120" | "CSN400121" | "CSN400122" | "CSN400123";
export type TNLugarExpedicionErrorOutput = "CSN400130" | "CSN400131" | "CSN400132" | "CSN400133";
export type TErrors =
  | ""
  | "CSN400000"
  | "CSN400001"
  | TNComprobanteFechaErrorOutput
  | TNSerieErrorOutput
  | TNFolioErrorOutput
  | TNMetodoPagoOutput
  | TNFormaPagoErrorOutput
  | TNSubtotalErrorOutput
  | TNDescuentoErrorOutput
  | TNTotalErrorOutput
  | TNMonedaErrorOutput
  | TNTipoCambioErrorOutput
  | TNExportacionErrorOuput
  | TNCondicionesPagoErrorOutput
  | TNLugarExpedicionErrorOutput;
export type TErrorOutput = {
  code: TErrors;
  message: string;
  codeSat?: string;
};
