class FacturaError extends Error {
  public code?: string;
  public satError?: string;
  constructor(message: string, code?: string, codeSat?: string) {
    super(message);
    this.name = "FacturaError";
    this.code = code;
    this.satError = codeSat;
  }
}
export default FacturaError;
