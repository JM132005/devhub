// actualizar-tarea.dto.ts → cambiar responsable, milestone, prioridad o rama de Git de una tarea.
// OmitType: copia CrearTareaDto SIN el campo specId (la spec de origen no se cambia).

import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsOptional, Matches } from 'class-validator';
import { CrearTareaDto } from './crear-tarea.dto.js';

export class ActualizarTareaDto extends PartialType(
  OmitType(CrearTareaDto, ['specId'] as const),
) {
  // Rama con la convención del equipo: feat/5-login, fix/9-token, docs/..., test/..., ci/...
  @IsOptional()
  @Matches(/^(feat|fix|docs|test|ci)\/[\w.-]+$/, {
    message: 'La rama debe ser tipo/nombre, ej: feat/5-login-api',
  })
  rama?: string;
}
