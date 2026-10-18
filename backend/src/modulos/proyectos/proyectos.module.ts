// proyectos.module.ts → empaqueta proyectos y exporta su servicio para los demás módulos.

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Proyecto, ProyectoEsquema } from './esquemas/proyecto.esquema.js';
import { Tarea, TareaEsquema } from '../tareas/esquemas/tarea.esquema.js';
import { ProyectosService } from './proyectos.service.js';
import { ProyectosController } from './proyectos.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Proyecto.name, schema: ProyectoEsquema },
      { name: Tarea.name, schema: TareaEsquema }, // necesario para la regla RN-06
    ]),
  ],
  controllers: [ProyectosController],
  providers: [ProyectosService],
  exports: [ProyectosService],
})
export class ProyectosModule {}
