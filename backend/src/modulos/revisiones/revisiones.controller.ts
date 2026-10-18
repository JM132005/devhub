// revisiones.controller.ts → rutas de Code Review.

import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { UsuarioActual } from '../../comun/decoradores/usuario-actual.decorator.js';
import { IdMongoPipe } from '../../comun/pipes/id-mongo.pipe.js';
import type { UsuarioToken } from '../../comun/usuario-token.js';
import { RevisionesService } from './revisiones.service.js';
import { RegistrarRevisionDto } from './dto/registrar-revision.dto.js';
import { AprobarRevisionDto } from './dto/aprobar-revision.dto.js';
import { SolicitarCambiosDto } from './dto/solicitar-cambios.dto.js';

@Controller()
export class RevisionesController {
  constructor(private readonly revisionesService: RevisionesService) {}

  // GET /api/proyectos/:proyectoId/revisiones
  @Get('proyectos/:proyectoId/revisiones')
  listar(
    @Param('proyectoId', IdMongoPipe) proyectoId: string,
    @UsuarioActual() u: UsuarioToken,
  ) {
    return this.revisionesService.listarPorProyecto(proyectoId, u);
  }

  // POST /api/tareas/:tareaId/revisiones → registrar PR
  @Post('tareas/:tareaId/revisiones')
  registrar(
    @Param('tareaId', IdMongoPipe) tareaId: string,
    @Body() dto: RegistrarRevisionDto,
    @UsuarioActual() u: UsuarioToken,
  ) {
    return this.revisionesService.registrar(tareaId, dto, u);
  }

  // POST /api/revisiones/:id/aprobar
  @HttpCode(200)
  @Post('revisiones/:id/aprobar')
  aprobar(
    @Param('id', IdMongoPipe) id: string,
    @Body() dto: AprobarRevisionDto,
    @UsuarioActual() u: UsuarioToken,
  ) {
    return this.revisionesService.aprobar(id, dto, u);
  }

  // POST /api/revisiones/:id/solicitar-cambios
  @HttpCode(200)
  @Post('revisiones/:id/solicitar-cambios')
  solicitarCambios(
    @Param('id', IdMongoPipe) id: string,
    @Body() dto: SolicitarCambiosDto,
    @UsuarioActual() u: UsuarioToken,
  ) {
    return this.revisionesService.solicitarCambios(id, dto.comentario, u);
  }
}
