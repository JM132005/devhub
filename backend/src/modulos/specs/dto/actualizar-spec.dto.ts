// actualizar-spec.dto.ts → editar una spec; cada edición guarda una versión en el historial (HU-08).

import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CrearSpecDto } from './crear-spec.dto.js';

export class ActualizarSpecDto extends PartialType(CrearSpecDto) {
  // Descripción corta del cambio que se guarda en el historial.
  @IsOptional()
  @IsString()
  cambio?: string;
}
