// crear-prompt.dto.ts → guardar un prompt útil en la biblioteca (HU-16).

import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CATEGORIAS_PROMPT } from '../../../comun/constantes.js';

export class CrearPromptDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsIn(CATEGORIAS_PROMPT)
  categoria: string;

  @IsString()
  @IsNotEmpty()
  contenido: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  etiquetas?: string[];
}
