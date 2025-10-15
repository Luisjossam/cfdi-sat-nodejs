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
//RECEPTOR
type TNReceptorRfcErrorOutput = "CSN401010" | "CSN401011" | "CSN401012" | "CSN401013";
type TNReceptorNombreErrorOutput = "CSN401020" | "CSN401021" | "CSN401022" | "CSN401023" | "CSN401024";
type TNReceptorDomFiscalErrorOutput = "CSN401030" | "CSN401031" | "CSN401032" | "CSN401033";
type TNReceptorRegFiscalErrorOutput = "CSN401040" | "CSN401041" | "CSN401042" | "CSN401043" | "CSN401044" | "CSN401045";
type TNReceptorUsoCfdiErrorOutput = "CSN401050" | "CSN401051" | "CSN401052" | "CSN401053" | "CSN401054";
type TNReceptorResFiscalErrorOutput = "CSN401060" | "CSN401061" | "CSN401062" | "CSN401063" | "CSN401064";
type TNReceptorNumRegIdErrorOutput = "CSN401070" | "CSN401071" | "CSN401072" | "CSN401073";
// EMISOR
type TNEmisorRfcErrorOutput = "CSN402010" | "CSN402011" | "CSN402012" | "CSN402013";
type TNEmisorNombreErrorOutput = "CSN402020" | "CSN402021" | "CSN402022" | "CSN402023";
type TNEmisorRegFiscalErrorOutput = "CSN402030" | "CSN402031" | "CSN402032" | "CSN402033" | "CSN402034";
type TNEmisorFacAtrAdqErrorOutput = "CSN402040" | "CSN402041";
// INFORMACION GLOBAL
type TNIGPeriodicidadErrorOutput = "CSN403010" | "CSN403011" | "CSN403012" | "CSN403013" | "CSN403014";
export type TErrors =
  | ""
  | "CSN400000"
  | "CSN400001"
  | "CSN401000"
  | "CSN401001"
  | "CSN402001"
  | "CSN403001"
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
  | TNLugarExpedicionErrorOutput
  | TNReceptorRfcErrorOutput
  | TNReceptorNombreErrorOutput
  | TNReceptorDomFiscalErrorOutput
  | TNReceptorRegFiscalErrorOutput
  | TNReceptorUsoCfdiErrorOutput
  | TNReceptorResFiscalErrorOutput
  | TNReceptorNumRegIdErrorOutput
  | TNEmisorRfcErrorOutput
  | TNEmisorNombreErrorOutput
  | TNEmisorRegFiscalErrorOutput
  | TNEmisorFacAtrAdqErrorOutput
  | TNIGPeriodicidadErrorOutput;

export type TErrorOutput = {
  code: TErrors;
  message: string;
  codeSat?: string;
};

type TNRfcErrorOutput = "CSN401000";
