// registrar-revision.dto.ts → registrar el Pull Request de una tarea para pedir revisión (HU-12).

import { IsMongoId, IsUrl } from 'class-validator';

export class RegistrarRevisionDto {
  // IsUrl: debe ser un enlace válido (ej: https://github.com/equipo/devhub/pull/5).
  @IsUrl({}, { message: 'urlPr debe ser el enlace del Pull Request' })
  urlPr: string;

  // Compañero que revisará (debe ser distinto del autor → RN-04).
  @IsMongoId({ message: 'revisorId no es válido' })
  revisorId: string;
}
