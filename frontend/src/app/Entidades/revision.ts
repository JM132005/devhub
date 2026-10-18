// revision.ts → ENTIDAD de una revisión de código (Pull Request).

import { UsuarioResumen } from './usuario';

export type EstadoRevision = 'ABIERTO' | 'CAMBIOS_SOLICITADOS' | 'APROBADO';

// Los cuatro puntos que el revisor debe confirmar.
export interface Checklist {
  pipelineVerde: boolean;
  cumpleSpec: boolean;
  tienePruebas: boolean;
  codigoComentado: boolean;
}

export interface Revision {
  _id: string;
  tareaId: { _id: string; titulo: string; rama: string | null } | null;
  urlPr: string;
  autorId: UsuarioResumen | null;
  revisorId: UsuarioResumen | null;
  estado: EstadoRevision;
  checklist: Checklist;
  comentario: string;
  createdAt?: string;
}
