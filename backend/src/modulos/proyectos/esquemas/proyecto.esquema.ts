// proyecto.esquema.ts → PROYECTO (colección "proyectos") con sus MILESTONES embebidos.

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// Types.ObjectId: tipo de los _id de MongoDB; se usa para REFERENCIAR otros documentos.
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { ESTADOS_PROYECTO } from '../../../comun/constantes.js';

// ---------- Subdocumento Milestone (vive DENTRO del proyecto) ----------
// _id: true → cada milestone tiene su propio _id (las tareas lo referencian).
@Schema({ _id: true })
export class Milestone {
  _id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true })
  fechaLimite: Date;

  @Prop({ default: false })
  cerrado: boolean;
}
export const MilestoneEsquema = SchemaFactory.createForClass(Milestone);

// ---------- Documento Proyecto ----------
export type ProyectoDocumento = HydratedDocument<Proyecto>;

@Schema({ collection: 'proyectos', timestamps: true })
export class Proyecto {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ default: '' })
  descripcion: string;

  @Prop({ default: '' })
  cliente: string;

  // Formato "usuario/repositorio" de GitHub (ej: equipo/devhub).
  @Prop({ default: '' })
  repoGithub: string;

  @Prop({ enum: ESTADOS_PROYECTO, default: 'PLANIFICACION' })
  estado: string;

  // ref: 'Usuario' → permite usar populate() para traer el nombre del líder.
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Usuario', required: true })
  liderId: Types.ObjectId;

  // Arreglo de referencias a usuarios (los desarrolladores del equipo).
  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Usuario' }], default: [] })
  miembros: Types.ObjectId[];

  // Arreglo de subdocumentos EMBEBIDOS (ventaja NoSQL: se leen junto al proyecto).
  @Prop({ type: [MilestoneEsquema], default: [] })
  milestones: Milestone[];
}

export const ProyectoEsquema = SchemaFactory.createForClass(Proyecto);
