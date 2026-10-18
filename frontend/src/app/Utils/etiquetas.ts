// etiquetas.ts → textos legibles para los estados (la API usa MAYUSCULAS_CON_GUION).

import { EstadoTarea } from '../Entidades/tarea';

// Objeto "diccionario": clave = valor de la API, valor = texto que ve el usuario.
export const ETIQUETAS: Record<string, string> = {
  // Proyecto
  PLANIFICACION: 'Planificación',
  DESARROLLO: 'Desarrollo',
  PRUEBAS: 'Pruebas',
  PRODUCCION: 'Producción',
  // Spec
  BORRADOR: 'Borrador',
  EN_REVISION: 'En revisión',
  APROBADA: 'Aprobada',
  IMPLEMENTADA: 'Implementada',
  // Tarea
  POR_HACER: 'Por hacer',
  EN_PROGRESO: 'En progreso',
  HECHO: 'Hecho',
  // Revisión
  ABIERTO: 'Abierto',
  CAMBIOS_SOLICITADOS: 'Cambios solicitados',
  APROBADO: 'Aprobado',
  // Roles
  ADMIN: 'Administrador',
  LIDER: 'Líder',
  DESARROLLADOR: 'Desarrollador',
  // Prioridad
  ALTA: 'Alta',
  MEDIA: 'Media',
  BAJA: 'Baja',
};

// Devuelve la etiqueta o el mismo texto si no está en el diccionario.
export function etiqueta(valor: string | null | undefined): string {
  return valor ? (ETIQUETAS[valor] ?? valor) : '—';
}

// Arreglo con las columnas del Kanban en orden.
export const COLUMNAS_KANBAN: EstadoTarea[] = ['POR_HACER', 'EN_PROGRESO', 'EN_REVISION', 'HECHO'];

// Puntos de la checklist con su texto (mismos que la plantilla de PR de GitHub).
export const PUNTOS_CHECKLIST = [
  { clave: 'pipelineVerde', texto: 'El pipeline está en verde' },
  { clave: 'cumpleSpec', texto: 'Cumple los criterios de la spec' },
  { clave: 'tienePruebas', texto: 'Tiene pruebas (TDD)' },
  { clave: 'codigoComentado', texto: 'Código comentado y ordenado' },
] as const;
