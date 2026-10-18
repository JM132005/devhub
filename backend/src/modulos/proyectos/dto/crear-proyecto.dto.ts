// crear-proyecto.dto.ts → datos para crear un proyecto (HU-03).

import {
  IsArray,
  IsMongoId,
  IsOptional,
  IsString,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class CrearProyectoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  cliente?: string;

  // Matches: valida con una expresión regular el formato "usuario/repositorio" (o vacío).
  @IsOptional()
  @Matches(/^$|^[\w.-]+\/[\w.-]+$/, {
    message: 'repoGithub debe tener el formato usuario/repositorio',
  })
  repoGithub?: string;

  // IsMongoId({ each: true }): cada elemento del arreglo debe ser un ObjectId válido.
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  miembros?: string[];

  // El ADMIN puede asignar otro líder; si no se envía, el líder es quien crea el proyecto.
  @IsOptional()
  @IsMongoId()
  liderId?: string;
}
