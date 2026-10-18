// actualizar-proyecto.dto.ts → editar datos o cambiar el ESTADO del proyecto (HU-05).

// PartialType: copia las reglas de CrearProyectoDto y vuelve todos los campos opcionales.
import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { CrearProyectoDto } from './crear-proyecto.dto.js';
import { ESTADOS_PROYECTO } from '../../../comun/constantes.js';

export class ActualizarProyectoDto extends PartialType(CrearProyectoDto) {
  @IsOptional()
  @IsIn(ESTADOS_PROYECTO)
  estado?: string;
}
