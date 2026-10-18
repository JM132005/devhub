// revisiones.module.ts → empaqueta Code Review.

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Revision, RevisionEsquema } from './esquemas/revision.esquema.js';
import { Tarea, TareaEsquema } from '../tareas/esquemas/tarea.esquema.js';
import { RevisionesService } from './revisiones.service.js';
import { RevisionesController } from './revisiones.controller.js';
import { ProyectosModule } from '../proyectos/proyectos.module.js';
import { TareasModule } from '../tareas/tareas.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Revision.name, schema: RevisionEsquema },
      { name: Tarea.name, schema: TareaEsquema },
    ]),
    ProyectosModule,
    TareasModule, // para mover la tarea cuando el PR se aprueba o se rechaza
  ],
  controllers: [RevisionesController],
  providers: [RevisionesService],
})
export class RevisionesModule {}
