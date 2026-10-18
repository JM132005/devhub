// proyecto.ts → ENTIDADES de proyecto y milestone.

import { Usuario } from './usuario';

export type EstadoProyecto = 'PLANIFICACION' | 'DESARROLLO' | 'PRUEBAS' | 'PRODUCCION';

export interface Milestone {
  _id: string;
  nombre: string;
  fechaLimite: string; // la API envía fechas como texto ISO (2026-10-24T00:00:00.000Z)
  cerrado: boolean;
}

export interface Proyecto {
  _id: string;
  nombre: string;
  descripcion: string;
  cliente: string;
  repoGithub: string;
  estado: EstadoProyecto;
  // Con populate llega como objeto Usuario; sin populate llega como texto (id).
  liderId: Usuario | string;
  miembros: (Usuario | string)[];
  milestones: Milestone[];
  createdAt?: string;
}

// Datos que el formulario envía para crear un proyecto.
export interface NuevoProyecto {
  nombre: string;
  descripcion: string;
  cliente: string;
  repoGithub: string;
  miembros: string[];
}
