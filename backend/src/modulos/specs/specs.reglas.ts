// specs.reglas.ts → reglas PURAS del ciclo de vida de una especificación (SDD).
//
//   BORRADOR ──enviar──▶ EN_REVISION ──aprobar──▶ APROBADA ──(tareas HECHO)──▶ IMPLEMENTADA
//       ▲                    │                        │
//       └────devolver────────┘                        └──editar──▶ EN_REVISION (RN-05)

import { EstadoSpec, Rol } from '../../comun/constantes.js';

// Acciones que se pueden pedir sobre una spec.
export type AccionSpec = 'enviar' | 'aprobar' | 'devolver';

// Objeto "tabla de transiciones": para cada acción, desde qué estados se permite y a cuál lleva.
const TRANSICIONES: Record<
  AccionSpec,
  { desde: EstadoSpec[]; hacia: EstadoSpec }
> = {
  enviar: { desde: ['BORRADOR'], hacia: 'EN_REVISION' },
  aprobar: { desde: ['EN_REVISION'], hacia: 'APROBADA' },
  devolver: { desde: ['EN_REVISION'], hacia: 'BORRADOR' },
};

// Devuelve el nuevo estado, o null si la acción no está permitida desde el estado actual.
export function siguienteEstado(
  actual: EstadoSpec,
  accion: AccionSpec,
): EstadoSpec | null {
  const regla = TRANSICIONES[accion];
  return regla.desde.includes(actual) ? regla.hacia : null;
}

// RN-01: solo LIDER o ADMIN aprueban (o devuelven) specs.
export function puedeAprobar(rol: Rol): boolean {
  return rol === 'LIDER' || rol === 'ADMIN';
}

// RN-05: si se edita una spec APROBADA vuelve a EN_REVISION.
// Una spec IMPLEMENTADA ya no se edita (devuelve null); en otros estados se mantiene igual.
export function estadoTrasEditar(actual: EstadoSpec): EstadoSpec | null {
  if (actual === 'IMPLEMENTADA') return null;
  if (actual === 'APROBADA') return 'EN_REVISION';
  return actual;
}

// Genera el código de la siguiente spec: 0 existentes → SPEC-001; 11 → SPEC-012.
// padStart(3, '0'): rellena con ceros a la izquierda hasta 3 dígitos.
export function siguienteCodigo(existentes: number): string {
  return `SPEC-${String(existentes + 1).padStart(3, '0')}`;
}
