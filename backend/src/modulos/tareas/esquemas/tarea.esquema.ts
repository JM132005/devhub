// tarea.esquema.ts → TAREA del tablero Kanban (colección "tareas").

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { ESTADOS_TAREA, PRIORIDADES } from '../../../comun/constantes.js';

export type TareaDocumento = HydratedDocument<Tarea>;

@Schema({ collection: 'tareas', timestamps: true })
export class Tarea {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Proyecto', required: true })
  proyectoId: Types.ObjectId;

  // OBLIGATORIO: toda tarea nace de una spec (regla RN-02).
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Spec', required: true })
  specId: Types.ObjectId;

  // _id de un milestone embebido en el proyecto (opcional).
  @Prop({ type: SchemaTypes.ObjectId, default: null })
  milestoneId: Types.ObjectId | null;

  @Prop({ required: true, trim: true })
  titulo: string;

  @Prop({ default: '' })
  descripcion: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Usuario', default: null })
  asignadoId: Types.ObjectId | null;

  @Prop({ enum: ESTADOS_TAREA, default: 'POR_HACER' })
  estado: string;

  @Prop({ enum: PRIORIDADES, default: 'MEDIA' })
  prioridad: string;

  // Rama de Git donde se trabaja (ej: feat/5-login-api).
  @Prop({ type: String, default: null })
  rama: string | null;
}

export const TareaEsquema = SchemaFactory.createForClass(Tarea);
// Índice para que el Kanban (tareas de un proyecto por estado) sea rápido.
TareaEsquema.index({ proyectoId: 1, estado: 1 });
