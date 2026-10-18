// crear-spec.dto.ts → datos para escribir una especificación (HU-06).

import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CrearSpecDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty({ message: 'La historia de usuario es obligatoria' })
  historia: string;

  // ArrayMinSize(1): al menos un requisito; IsString({ each: true }): cada elemento es texto.
  @IsArray()
  @ArrayMinSize(1, { message: 'Agrega al menos un requisito' })
  @IsString({ each: true })
  requisitos: string[];

  @IsArray()
  @ArrayMinSize(1, { message: 'Agrega al menos un criterio de aceptación' })
  @IsString({ each: true })
  criteriosAceptacion: string[];
}
