// tareas.module.ts → empaqueta el Kanban. Exporta el servicio para que Revisiones mueva tareas.

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tarea, TareaEsquema } from './esquemas/tarea.esquema.js';
import { Spec, SpecEsquema } from '../specs/esquemas/spec.esquema.js';
import {
  Revision,
  RevisionEsquema,
} from '../revisiones/esquemas/revision.esquema.js';
import { TareasService } from './tareas.service.js';
import { TareasController } from './tareas.controller.js';
import { ProyectosModule } from '../proyectos/proyectos.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tarea.name, schema: TareaEsquema },
      { name: Spec.name, schema: SpecEsquema }, // para RN-02 y marcar specs IMPLEMENTADAS
      { name: Revision.name, schema: RevisionEsquema }, // para RN-03
    ]),
    ProyectosModule,
  ],
  controllers: [TareasController],
  providers: [TareasService],
  exports: [TareasService],
})
export class TareasModule {}
