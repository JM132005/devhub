// specs.controller.ts → rutas de especificaciones.
// @Controller() sin prefijo porque hay rutas bajo /proyectos/:id/specs y otras bajo /specs/:id.

import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from '../../comun/decoradores/roles.decorator.js';
import { UsuarioActual } from '../../comun/decoradores/usuario-actual.decorator.js';
import { IdMongoPipe } from '../../comun/pipes/id-mongo.pipe.js';
import type { UsuarioToken } from '../../comun/usuario-token.js';
import { SpecsService } from './specs.service.js';
import { CrearSpecDto } from './dto/crear-spec.dto.js';
import { ActualizarSpecDto } from './dto/actualizar-spec.dto.js';
import { ComentarioDto } from './dto/comentario.dto.js';

@Controller()
export class SpecsController {
  constructor(private readonly specsService: SpecsService) {}

  // GET /api/proyectos/:proyectoId/specs
  @Get('proyectos/:proyectoId/specs')
  listar(
    @Param('proyectoId', IdMongoPipe) proyectoId: string,
    @UsuarioActual() u: UsuarioToken,
  ) {
    return this.specsService.listar(proyectoId, u);
  }

  // POST /api/proyectos/:proyectoId/specs
  @Post('proyectos/:proyectoId/specs')
  crear(
    @Param('proyectoId', IdMongoPipe) proyectoId: string,
    @Body() dto: CrearSpecDto,
    @UsuarioActual() u: UsuarioToken,
  ) {
    return this.specsService.crear(proyectoId, dto, u);
  }

  // GET /api/specs/:id
  @Get('specs/:id')
  detalle(
    @Param('id', IdMongoPipe) id: string,
    @UsuarioActual() u: UsuarioToken,
  ) {
    return this.specsService.detalle(id, u);
  }

  // PATCH /api/specs/:id → editar (guarda versión, RN-05)
  @Patch('specs/:id')
  actualizar(
    @Param('id', IdMongoPipe) id: string,
    @Body() dto: ActualizarSpecDto,
    @UsuarioActual() u: UsuarioToken,
  ) {
    return this.specsService.actualizar(id, dto, u);
  }

  // POST /api/specs/:id/enviar → BORRADOR → EN_REVISION
  @HttpCode(200)
  @Post('specs/:id/enviar')
  enviar(
    @Param('id', IdMongoPipe) id: string,
    @UsuarioActual() u: UsuarioToken,
  ) {
    return this.specsService.cambiarEstado(id, 'enviar', u);
  }

  // POST /api/specs/:id/aprobar → EN_REVISION → APROBADA (RN-01)
  @Roles('LIDER', 'ADMIN')
  @HttpCode(200)
  @Post('specs/:id/aprobar')
  aprobar(
    @Param('id', IdMongoPipe) id: string,
    @UsuarioActual() u: UsuarioToken,
  ) {
    return this.specsService.cambiarEstado(id, 'aprobar', u);
  }

  // POST /api/specs/:id/devolver → EN_REVISION → BORRADOR con comentario obligatorio
  @Roles('LIDER', 'ADMIN')
  @HttpCode(200)
  @Post('specs/:id/devolver')
  devolver(
    @Param('id', IdMongoPipe) id: string,
    @Body() dto: ComentarioDto,
    @UsuarioActual() u: UsuarioToken,
  ) {
    return this.specsService.cambiarEstado(id, 'devolver', u, dto.texto);
  }

  // POST /api/specs/:id/comentarios
  @Post('specs/:id/comentarios')
  comentar(
    @Param('id', IdMongoPipe) id: string,
    @Body() dto: ComentarioDto,
    @UsuarioActual() u: UsuarioToken,
  ) {
    return this.specsService.comentar(id, dto.texto, u);
  }
}
