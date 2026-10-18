// utilidades.ts → funciones pequeñas reutilizables en varios módulos.

// mismoId(): compara dos ids aunque uno sea ObjectId y otro texto.
// En Mongo, ObjectId("abc") === "abc" da false, por eso se convierten ambos a String.
export function mismoId(a: unknown, b: unknown): boolean {
  return (
    a !== null &&
    a !== undefined &&
    b !== null &&
    b !== undefined &&
    String(a) === String(b)
  );
}
