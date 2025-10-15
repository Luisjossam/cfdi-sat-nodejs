class ErrorBuilder {
  /**
   *
   * @param value name of property
   * @returns A string with the error message "La propiedad "{value}" no puede estar vacía."
   */
  public static emptyValue(value: string, complement?: string): string {
    return `La propiedad "${value}" ${complement ? complement + " " : ""}no puede estar vacía.`;
  }
  /**
   *
   * @param value name of property
   * @returns A string with the error message "No existe la propiedad "{value}"."
   */
  public static undefinedValue(value: string, complement?: string): string {
    return `No existe la propiedad "${value}"${complement ? " " + complement : ""}.`;
  }
  /**
   *
   * @param value name of property
   * @param types Array of valid types
   * @returns A string with the error message "El tipo de la propiedad "{value}" no es valido. Debe ser de tipo {types.join(" o ")}."
   */
  public static valueMustBe(value: string, types: string[], complement?: string): string {
    return `El tipo de la propiedad "${value}" ${complement ? complement + " " : ""}no es valido. Debe ser de tipo ${types.map((i) => i).join(" o ")}.`;
  }
  /**
   *
   * @param value name of property
   * @param pattern pattern that the property must meet
   * @returns A string with the error message "La propiedad "{value}" no cumple con el patrón requerido: {pattern}"
   */
  public static valueNotMeetPattern(value: string, pattern: string, complement?: string): string {
    return `La propiedad "${value}" ${complement ? complement + " " : ""}no cumple con el patrón requerido: ${pattern}`;
  }
  public static nodeUndefined(value: string, complement?: string): string {
    return `Hace falta el método "${value}()" ${complement ?? ""}`;
  }
  public static valueMinLength(value: string, length: number, complement?: string): string {
    return `El valor de la propiedad "${value}" ${complement ? complement + " " : ""}no cumple con la longitud mínima de "${length}".`;
  }
  public static valueMaxLength(value: string, length: number, complement?: string): string {
    return `El valor de la propiedad "${value}" ${complement ? complement + " " : ""}no cumple con la longitud máxima de "${length}".`;
  }
  /**
   *
   * @param value value of property
   * @param catalog name of catalog
   * @returns A string with the error message "El valor de {value} no contiene un valor del catálogo {catalog}."
   */
  public static valueNotFoundInCatalog(value: string, catalog: string, complement?: string): string {
    return `El valor de la propiedad "${value}" ${complement ? complement + " " : ""}no contiene un valor del catálogo ${catalog}.`;
  }
}
export default ErrorBuilder;
