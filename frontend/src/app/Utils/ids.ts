// ids.ts → ayudas para trabajar con ids que pueden llegar como texto o como objeto (populate).

// Obtiene el _id ya sea que llegue "abc123" o { _id: "abc123", nombre: "Ana" }.
export function idDe(valor: string | { _id: string } | null | undefined): string {
  if (!valor) return '';
  return typeof valor === 'string' ? valor : valor._id;
}

// Obtiene el nombre si llega como objeto; si no, un guion.
export function nombreDe(valor: string | { nombre?: string } | null | undefined): string {
  return valor && typeof valor === 'object' && valor.nombre ? valor.nombre : '—';
}
