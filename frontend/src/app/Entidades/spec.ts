// spec.ts → ENTIDAD de una especificación (Spec Driven Development).

import { UsuarioResumen } from './usuario';

export type EstadoSpec = 'BORRADOR' | 'EN_REVISION' | 'APROBADA' | 'IMPLEMENTADA';

export interface ComentarioSpec {
  autorId: UsuarioResumen | null;
  texto: string;
  fecha: string;
}

export interface VersionSpec {
  version: number;
  cambio: string;
  autorId: UsuarioResumen | null;
  fecha: string;
}

export interface Spec {
  _id: string;
  proyectoId: string;
  codigo: string; // SPEC-001
  titulo: string;
  historia: string;
  requisitos: string[]; // arreglo de textos
  criteriosAceptacion: string[];
  estado: EstadoSpec;
  version: number;
  autorId: UsuarioResumen | null;
  aprobadaPorId: UsuarioResumen | null;
  comentarios: ComentarioSpec[];
  historial?: VersionSpec[];
}

// Datos del formulario de spec (crear o editar).
export interface DatosSpec {
  titulo: string;
  historia: string;
  requisitos: string[];
  criteriosAceptacion: string[];
  cambio?: string; // solo al editar
}
