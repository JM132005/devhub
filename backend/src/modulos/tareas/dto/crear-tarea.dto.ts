// crear-tarea.dto.ts → datos para crear una tarea a partir de una spec aprobada (HU-09).

import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PRIORIDADES } from '../../../comun/constantes.js';

export class CrearTareaDto {
  // Spec de la que nace la tarea (debe estar APROBADA → RN-02).
  @IsMongoId({ message: 'specId no es válido' })
  specId: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsMongoId()
  asignadoId?: string;

  @IsOptional()
  @IsMongoId()
  milestoneId?: string;

  @IsOptional()
  @IsIn(PRIORIDADES)
  prioridad?: string;
}
