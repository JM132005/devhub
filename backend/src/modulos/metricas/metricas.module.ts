// metricas.module.ts → solo LEE colecciones de otros módulos para calcular números.

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tarea, TareaEsquema } from '../tareas/esquemas/tarea.esquema.js';
import { Spec, SpecEsquema } from '../specs/esquemas/spec.esquema.js';
import {
  Revision,
  RevisionEsquema,
} from '../revisiones/esquemas/revision.esquema.js';
import { ProyectosModule } from '../proyectos/proyectos.module.js';
import { MetricasService } from './metricas.service.js';
import { MetricasController } from './metricas.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tarea.name, schema: TareaEsquema },
      { name: Spec.name, schema: SpecEsquema },
      { name: Revision.name, schema: RevisionEsquema },
    ]),
    ProyectosModule,
  ],
  controllers: [MetricasController],
  providers: [MetricasService],
})
export class MetricasModule {}
