// metricas.controller.ts → rutas del dashboard.

import { Controller, Get, Param } from '@nestjs/common';
import { UsuarioActual } from '../../comun/decoradores/usuario-actual.decorator.js';
import { IdMongoPipe } from '../../comun/pipes/id-mongo.pipe.js';
import type { UsuarioToken } from '../../comun/usuario-token.js';
import { MetricasService } from './metricas.service.js';

@Controller()
export class MetricasController {
  constructor(private readonly metricasService: MetricasService) {}

  // GET /api/metricas/resumen → pantalla de inicio
  @Get('metricas/resumen')
  resumen(@UsuarioActual() u: UsuarioToken) {
    return this.metricasService.resumen(u);
  }

  // GET /api/proyectos/:proyectoId/metricas → dashboard del proyecto
  @Get('proyectos/:proyectoId/metricas')
  delProyecto(
    @Param('proyectoId', IdMongoPipe) proyectoId: string,
    @UsuarioActual() u: UsuarioToken,
  ) {
    return this.metricasService.delProyecto(proyectoId, u);
  }
}
