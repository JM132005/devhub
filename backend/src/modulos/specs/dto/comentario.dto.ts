// comentario.dto.ts → texto de un comentario (obligatorio al devolver una spec).

import { IsNotEmpty, IsString } from 'class-validator';

export class ComentarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El comentario es obligatorio' })
  texto: string;
}
