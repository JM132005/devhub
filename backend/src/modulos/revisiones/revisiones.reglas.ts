// revisiones.reglas.ts → reglas PURAS del Code Review.

import { mismoId } from '../../comun/utilidades.js';

// RN-04: nadie revisa su propio Pull Request.
export function revisorValido(autorId: unknown, revisorId: unknown): boolean {
  return !mismoId(autorId, revisorId);
}

// Para APROBAR, todos los puntos de la checklist deben estar marcados.
// Object.values(): arreglo con los valores del objeto → [true, true, false, ...]
export function checklistCompleta(checklist: Record<string, boolean>): boolean {
  const valores = Object.values(checklist);
  return valores.length > 0 && valores.every(Boolean);
}
