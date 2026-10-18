// revision.esquema.ts → REVISIÓN de código de un Pull Request (colección "revisiones").

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { ESTADOS_REVISION } from '../../../comun/constantes.js';

// Subdocumento con la checklist del revisor (mismos puntos que la plantilla de PR de GitHub).
@Schema({ _id: false })
export class Checklist {
  @Prop({ default: false }) pipelineVerde: boolean;
  @Prop({ default: false }) cumpleSpec: boolean;
  @Prop({ default: false }) tienePruebas: boolean;
  @Prop({ default: false }) codigoComentado: boolean;
}
const ChecklistEsquema = SchemaFactory.createForClass(Checklist);

export type RevisionDocumento = HydratedDocument<Revision>;

@Schema({ collection: 'revisiones', timestamps: true })
export class Revision {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Tarea', required: true })
  tareaId: Types.ObjectId;

  // Enlace al Pull Request real en GitHub.
  @Prop({ required: true })
  urlPr: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Usuario', required: true })
  autorId: Types.ObjectId;

  // Debe ser distinto del autor (regla RN-04).
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Usuario', required: true })
  revisorId: Types.ObjectId;

  @Prop({ enum: ESTADOS_REVISION, default: 'ABIERTO' })
  estado: string;

  @Prop({ type: ChecklistEsquema, default: () => ({}) })
  checklist: Checklist;

  @Prop({ default: '' })
  comentario: string;
}

export const RevisionEsquema = SchemaFactory.createForClass(Revision);
