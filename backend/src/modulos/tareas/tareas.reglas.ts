// tareas.reglas.ts → reglas PURAS de las tareas del Kanban.

import { EstadoSpec, EstadoTarea } from '../../comun/constantes.js';

// RN-02: solo se crean tareas a partir de una spec APROBADA (así se obliga a especificar antes de programar).
export function puedeCrearTarea(estadoSpec: EstadoSpec): boolean {
  return estadoSpec === 'APROBADA';
}

// RN-03: una tarea solo pasa a HECHO si tiene un Pull Request APROBADO.
// Cualquier otro movimiento entre columnas está permitido.
export function puedeMoverA(
  nuevoEstado: EstadoTarea,
  tieneRevisionAprobada: boolean,
): boolean {
  if (nuevoEstado === 'HECHO') return tieneRevisionAprobada;
  return true;
}

// Una spec pasa a IMPLEMENTADA cuando TODAS sus tareas están en HECHO (y tiene al menos una).
// every(): true si todos los elementos del arreglo cumplen la condición.
export function specCompletada(estadosTareas: EstadoTarea[]): boolean {
  return estadosTareas.length > 0 && estadosTareas.every((e) => e === 'HECHO');
}

// Al final de tareas.reglas.js o .ts

export function asignarResponsable(tarea: any, nuevoResponsable: string) {
  if (!nuevoResponsable || nuevoResponsable.trim() === '') {
    throw new Error('Usuario no válido');
  }
  tarea.responsable = nuevoResponsable;
  return tarea;
}