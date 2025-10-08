class Parse {
  public static parseNumber(value: number | undefined, decimals: number): string {
    if (value === undefined || value === 0) return "0";
    return value.toFixed(decimals);
  }
}
export default Parse;
