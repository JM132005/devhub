// proyectos.controller.ts → rutas /api/proyectos

import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Roles } from '../../comun/decoradores/roles.decorator.js';
import { UsuarioActual } from '../../comun/decoradores/usuario-actual.decorator.js';
import { IdMongoPipe } from '../../comun/pipes/id-mongo.pipe.js';
import type { UsuarioToken } from '../../comun/usuario-token.js';
import { ProyectosService } from './proyectos.service.js';
import { CrearProyectoDto } from './dto/crear-proyecto.dto.js';
import { ActualizarProyectoDto } from './dto/actualizar-proyecto.dto.js';
import { CrearMilestoneDto } from './dto/crear-milestone.dto.js';

@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  // GET /api/proyectos → mis proyectos.
  @Get()
  listar(@UsuarioActual() usuario: UsuarioToken) {
    return this.proyectosService.listar(usuario);
  }

  // POST /api/proyectos → solo LIDER o ADMIN crean proyectos.
  @Roles('LIDER', 'ADMIN')
  @Post()
  crear(@Body() dto: CrearProyectoDto, @UsuarioActual() usuario: UsuarioToken) {
    return this.proyectosService.crear(dto, usuario);
  }

  // GET /api/proyectos/:id → detalle.
  @Get(':id')
  detalle(
    @Param('id', IdMongoPipe) id: string,
    @UsuarioActual() usuario: UsuarioToken,
  ) {
    return this.proyectosService.detalle(id, usuario);
  }

  // PATCH /api/proyectos/:id → editar o cambiar estado.
  @Patch(':id')
  actualizar(
    @Param('id', IdMongoPipe) id: string,
    @Body() dto: ActualizarProyectoDto,
    @UsuarioActual() usuario: UsuarioToken,
  ) {
    return this.proyectosService.actualizar(id, dto, usuario);
  }

  // POST /api/proyectos/:id/milestones → agregar milestone.
  @Post(':id/milestones')
  agregarMilestone(
    @Param('id', IdMongoPipe) id: string,
    @Body() dto: CrearMilestoneDto,
    @UsuarioActual() usuario: UsuarioToken,
  ) {
    return this.proyectosService.agregarMilestone(id, dto, usuario);
  }
}
