// cambiar-estado.dto.ts → mover una tarea de columna en el Kanban (HU-10).

import { IsIn } from 'class-validator';
import { ESTADOS_TAREA } from '../../../comun/constantes.js';

export class CambiarEstadoDto {
  @IsIn(ESTADOS_TAREA, { message: 'Estado no válido' })
  estado: string;
}
