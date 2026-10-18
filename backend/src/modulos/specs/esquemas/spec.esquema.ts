// spec.esquema.ts → ESPECIFICACIÓN (colección "specs"), el corazón de Spec Driven Development.
// Los COMENTARIOS y el HISTORIAL de versiones van embebidos: se leen en una sola consulta, sin JOIN.

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { ESTADOS_SPEC } from '../../../comun/constantes.js';

// Subdocumento: un comentario de revisión sobre la spec.
@Schema({ _id: false })
export class ComentarioSpec {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Usuario' })
  autorId: Types.ObjectId;

  @Prop({ required: true })
  texto: string;

  @Prop({ default: () => new Date() })
  fecha: Date;
}
const ComentarioSpecEsquema = SchemaFactory.createForClass(ComentarioSpec);

// Subdocumento: una "foto" de cómo era la spec antes de editarla.
@Schema({ _id: false })
export class VersionSpec {
  @Prop()
  version: number;

  // Descripción corta del cambio (ej: "Se agregó el caso de error").
  @Prop({ default: '' })
  cambio: string;

  // Copia del contenido anterior (título, historia, requisitos, criterios).
  @Prop({ type: Object, default: {} })
  contenido: Record<string, unknown>;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Usuario' })
  autorId: Types.ObjectId;

  @Prop({ default: () => new Date() })
  fecha: Date;
}
const VersionSpecEsquema = SchemaFactory.createForClass(VersionSpec);

export type SpecDocumento = HydratedDocument<Spec>;

@Schema({ collection: 'specs', timestamps: true })
export class Spec {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Proyecto', required: true })
  proyectoId: Types.ObjectId;

  // Código legible y único dentro del proyecto: SPEC-001, SPEC-002...
  @Prop({ required: true })
  codigo: string;

  @Prop({ required: true, trim: true })
  titulo: string;

  // Historia de usuario: "Como [rol] quiero [acción] para [beneficio]".
  @Prop({ required: true })
  historia: string;

  // Arreglos de textos.
  @Prop({ type: [String], default: [] })
  requisitos: string[];

  @Prop({ type: [String], default: [] })
  criteriosAceptacion: string[];

  @Prop({ enum: ESTADOS_SPEC, default: 'BORRADOR' })
  estado: string;

  @Prop({ default: 1 })
  version: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Usuario', required: true })
  autorId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Usuario', default: null })
  aprobadaPorId: Types.ObjectId | null;

  @Prop({ type: [ComentarioSpecEsquema], default: [] })
  comentarios: ComentarioSpec[];

  @Prop({ type: [VersionSpecEsquema], default: [] })
  historial: VersionSpec[];
}

export const SpecEsquema = SchemaFactory.createForClass(Spec);
// Índice compuesto: no se repite el mismo código dentro de un proyecto.
SpecEsquema.index({ proyectoId: 1, codigo: 1 }, { unique: true });
