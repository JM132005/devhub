// tareas.controller.ts → rutas del Kanban.

import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Roles } from '../../comun/decoradores/roles.decorator.js';
import { UsuarioActual } from '../../comun/decoradores/usuario-actual.decorator.js';
import { IdMongoPipe } from '../../comun/pipes/id-mongo.pipe.js';
import type { UsuarioToken } from '../../comun/usuario-token.js';
import { EstadoTarea } from '../../comun/constantes.js';
import { TareasService } from './tareas.service.js';
import { CrearTareaDto } from './dto/crear-tarea.dto.js';
import { ActualizarTareaDto } from './dto/actualizar-tarea.dto.js';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto.js';

@Controller()
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  // GET /api/proyectos/:proyectoId/tareas → tablero Kanban
  @Get('proyectos/:proyectoId/tareas')
  listar(
    @Param('proyectoId', IdMongoPipe) proyectoId: string,
    @UsuarioActual() u: UsuarioToken,
  ) {
    return this.tareasService.listar(proyectoId, u);
  }

  // POST /api/proyectos/:proyectoId/tareas → solo LIDER o ADMIN (RN-02 en el servicio)
  @Roles('LIDER', 'ADMIN')
  @Post('proyectos/:proyectoId/tareas')
  crear(
    @Param('proyectoId', IdMongoPipe) proyectoId: string,
    @Body() dto: CrearTareaDto,
    @UsuarioActual() u: UsuarioToken,
  ) {
    return this.tareasService.crear(proyectoId, dto, u);
  }

  // PATCH /api/tareas/:id → responsable, rama, prioridad...
  @Patch('tareas/:id')
  actualizar(
    @Param('id', IdMongoPipe) id: string,
    @Body() dto: ActualizarTareaDto,
    @UsuarioActual() u: UsuarioToken,
  ) {
    return this.tareasService.actualizar(id, dto, u);
  }

  // PATCH /api/tareas/:id/estado → mover de columna (RN-03)
  @Patch('tareas/:id/estado')
  cambiarEstado(
    @Param('id', IdMongoPipe) id: string,
    @Body() dto: CambiarEstadoDto,
    @UsuarioActual() u: UsuarioToken,
  ) {
    return this.tareasService.cambiarEstado(id, dto.estado as EstadoTarea, u);
  }
}
