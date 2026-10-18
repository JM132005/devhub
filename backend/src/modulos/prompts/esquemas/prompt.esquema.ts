// prompt.esquema.ts → PROMPT guardado en la biblioteca para usar con Copilot (colección "prompts").

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { CATEGORIAS_PROMPT } from '../../../comun/constantes.js';

export type PromptDocumento = HydratedDocument<Prompt>;

@Schema({ collection: 'prompts', timestamps: true })
export class Prompt {
  @Prop({ required: true, trim: true })
  titulo: string;

  @Prop({ enum: CATEGORIAS_PROMPT, required: true })
  categoria: string;

  // El texto del prompt; los <marcadores> se reemplazan al usarlo.
  @Prop({ required: true })
  contenido: string;

  @Prop({ type: [String], default: [] })
  etiquetas: string[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Usuario' })
  autorId: Types.ObjectId;

  // Cuántas personas marcaron el prompt como útil.
  @Prop({ default: 0 })
  votos: number;
}

export const PromptEsquema = SchemaFactory.createForClass(Prompt);
