// tarea.ts → ENTIDAD de una tarea del tablero Kanban.

import { UsuarioResumen } from './usuario';

export type EstadoTarea = 'POR_HACER' | 'EN_PROGRESO' | 'EN_REVISION' | 'HECHO';
export type Prioridad = 'ALTA' | 'MEDIA' | 'BAJA';

export interface Tarea {
  _id: string;
  proyectoId: string;
  // Con populate llega { _id, codigo, titulo } de la spec de origen.
  specId: { _id: string; codigo: string; titulo: string } | null;
  milestoneId: string | null;
  titulo: string;
  descripcion: string;
  asignadoId: UsuarioResumen | null;
  estado: EstadoTarea;
  prioridad: Prioridad;
  rama: string | null;
}

// Datos del formulario de nueva tarea.
export interface NuevaTarea {
  specId: string;
  titulo: string;
  asignadoId?: string;
  milestoneId?: string;
  prioridad: Prioridad;
}
