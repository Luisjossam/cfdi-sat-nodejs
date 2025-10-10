class ErrorBuilder {
  /**
   *
   * @param value name of property
   * @returns A string with the error message "La propiedad "{value}" no puede estar vacía."
   */
  public static emptyValue(value: string): string {
    return `La propiedad "${value}" no puede estar vacía.`;
  }
  /**
   *
   * @param value name of property
   * @returns A string with the error message "No existe la propiedad "{value}"."
   */
  public static undefinedValue(value: string): string {
    return `No existe la propiedad "${value}".`;
  }
  /**
   *
   * @param value name of property
   * @param types Array of valid types
   * @returns A string with the error message "El tipo de la propiedad "{value}" no es valido. Debe ser de tipo {types.join(" o ")}."
   */
  public static valueMustBe(value: string, types: string[]): string {
    return `El tipo de la propiedad "${value}" no es valido. Debe ser de tipo ${types.map((i) => i).join(" o ")}.`;
  }
  /**
   *
   * @param value name of property
   * @param pattern pattern that the property must meet
   * @returns A string with the error message "La propiedad "{value}" no cumple con el patrón requerido: {pattern}"
   */
  public static valueNotMeetPattern(value: string, pattern: string): string {
    return `La propiedad "${value}" no cumple con el patrón requerido: ${pattern}`;
  }
  public static nodeUndefined(value: string): string {
    return `Hace falta el método ${value}`;
  }
  public static valueMinLength(value: string, length: number): string {
    return `El valor de la propiedad "${value}" no cumple con la longitud mínima de "${length}".`;
  }
  public static valueMaxLength(value: string, length: number): string {
    return `El valor de la propiedad "${value}" no cumple con la longitud máxima de "${length}".`;
  }
  /**
   *
   * @param value value of property
   * @param catalog name of catalog
   * @returns A string with the error message "El valor de {value} no contiene un valor del catálogo {catalog}."
   */
  public static valueNotFoundInCatalog(value: string, catalog: string): string {
    return `El valor de la propiedad "${value}" no contiene un valor del catálogo ${catalog}.`;
  }
}
export default ErrorBuilder;
