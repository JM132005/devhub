// aprobar-revision.dto.ts → el revisor marca la checklist y aprueba (HU-13).

// Type: indica a class-transformer en qué clase convertir el objeto anidado.
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// Clase de la checklist: los cuatro puntos deben venir como true/false.
export class ChecklistDto {
  @IsBoolean() pipelineVerde: boolean;
  @IsBoolean() cumpleSpec: boolean;
  @IsBoolean() tienePruebas: boolean;
  @IsBoolean() codigoComentado: boolean;
}

export class AprobarRevisionDto {
  // ValidateNested: valida también las reglas de ChecklistDto.
  @ValidateNested()
  @Type(() => ChecklistDto)
  checklist: ChecklistDto;

  @IsOptional()
  @IsString()
  comentario?: string;
}
