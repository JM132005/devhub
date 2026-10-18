// solicitar-cambios.dto.ts → el revisor pide cambios explicando por qué.

import { IsNotEmpty, IsString } from 'class-validator';

export class SolicitarCambiosDto {
  @IsString()
  @IsNotEmpty({ message: 'Explica qué cambios se necesitan' })
  comentario: string;
}
