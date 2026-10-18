// metricas.ts → ENTIDADES de las respuestas del dashboard.

import { Tarea } from './tarea';

// Record<string, number>: objeto con claves de texto y valores numéricos → { HECHO: 3, POR_HACER: 2 }
export interface MetricasProyecto {
  tareasPorEstado: Record<string, number>;
  specsPorEstado: Record<string, number>;
  milestones: { _id: string; nombre: string; fechaLimite: string; total: number; hechas: number; porcentaje: number }[];
  revisionesAbiertas: number;
  avanceGeneral: number;
}

export interface Resumen {
  totalProyectos: number;
  // Las tareas del resumen traen el proyecto con populate.
  misTareas: (Omit<Tarea, 'proyectoId'> & { proyectoId: { _id: string; nombre: string } | null })[];
  specsPorAprobar: { _id: string; codigo: string; titulo: string; proyectoId: { _id: string; nombre: string } | null }[];
  revisionesPendientes: {
    _id: string;
    urlPr: string;
    tareaId: { _id: string; titulo: string; proyectoId: string } | null;
    autorId: { _id: string; nombre: string } | null;
  }[];
}
