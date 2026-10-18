// actualizar-usuario.dto.ts → el ADMIN puede cambiar nombre, rol o desactivar a un usuario.

import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
import { ROLES } from '../../../comun/constantes.js';

export class ActualizarUsuarioDto {
  @IsOptional() // si no se envía, no se valida ni se cambia
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsIn(ROLES)
  rol?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
