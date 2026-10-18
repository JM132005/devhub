// crear-usuario.dto.ts → datos que el ADMIN envía para crear un usuario.
// Cada decorador de class-validator es una regla; si no se cumple, la API responde 400.

import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ROLES } from '../../../comun/constantes.js';

export class CrearUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail({}, { message: 'El correo no es válido' }) // formato nombre@dominio.com
  correo: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  contrasena: string;

  @IsIn(ROLES) // solo ADMIN, LIDER o DESARROLLADOR
  rol: string;
}
