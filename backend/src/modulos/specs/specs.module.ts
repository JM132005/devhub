// specs.module.ts → empaqueta el módulo de especificaciones.

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Spec, SpecEsquema } from './esquemas/spec.esquema.js';
import { SpecsService } from './specs.service.js';
import { SpecsController } from './specs.controller.js';
import { ProyectosModule } from '../proyectos/proyectos.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Spec.name, schema: SpecEsquema }]),
    ProyectosModule,
  ],
  controllers: [SpecsController],
  providers: [SpecsService],
})
export class SpecsModule {}
