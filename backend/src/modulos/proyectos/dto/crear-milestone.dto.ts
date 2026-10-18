// crear-milestone.dto.ts → agregar un milestone (sprint con fecha) a un proyecto (HU-11).

import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CrearMilestoneDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  // IsDateString: texto con formato de fecha ISO, ej: "2026-10-24".
  @IsDateString({}, { message: 'fechaLimite debe ser una fecha (AAAA-MM-DD)' })
  fechaLimite: string;
}
