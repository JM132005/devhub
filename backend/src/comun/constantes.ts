// constantes.ts → valores fijos que usa TODO el sistema (roles y estados).
// Tenerlos en un solo archivo evita escribir textos distintos ("Lider" vs "LIDER") en cada módulo.

// "as const" convierte el arreglo en una lista de solo lectura con valores exactos,
// así TypeScript sabe que ROLES solo puede contener esos tres textos.
export const ROLES = ['ADMIN', 'LIDER', 'DESARROLLADOR'] as const;
// Tipo derivado del arreglo: Rol = 'ADMIN' | 'LIDER' | 'DESARROLLADOR'
export type Rol = (typeof ROLES)[number];

// Fases por las que pasa un proyecto.
export const ESTADOS_PROYECTO = [
  'PLANIFICACION',
  'DESARROLLO',
  'PRUEBAS',
  'PRODUCCION',
] as const;
export type EstadoProyecto = (typeof ESTADOS_PROYECTO)[number];

// Ciclo de vida de una especificación (SDD).
export const ESTADOS_SPEC = [
  'BORRADOR',
  'EN_REVISION',
  'APROBADA',
  'IMPLEMENTADA',
] as const;
export type EstadoSpec = (typeof ESTADOS_SPEC)[number];

// Columnas del tablero Kanban.
export const ESTADOS_TAREA = [
  'POR_HACER',
  'EN_PROGRESO',
  'EN_REVISION',
  'HECHO',
] as const;
export type EstadoTarea = (typeof ESTADOS_TAREA)[number];

// Estados de una revisión de código (Pull Request).
export const ESTADOS_REVISION = [
  'ABIERTO',
  'CAMBIOS_SOLICITADOS',
  'APROBADO',
] as const;
export type EstadoRevision = (typeof ESTADOS_REVISION)[number];

// Prioridad de una tarea.
export const PRIORIDADES = ['ALTA', 'MEDIA', 'BAJA'] as const;

// Categorías de la biblioteca de prompts.
export const CATEGORIAS_PROMPT = [
  'TESTING',
  'DOCUMENTACION',
  'REFACTOR',
  'CODIGO',
] as const;
