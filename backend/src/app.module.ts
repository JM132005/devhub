// app.module.ts → módulo RAÍZ: conecta la base de datos, la seguridad global y todos los módulos.

import { Module } from '@nestjs/common';
// APP_GUARD: token especial para registrar guards que se aplican a TODAS las rutas.
import { APP_GUARD } from '@nestjs/core';
// ConfigModule: carga las variables del archivo .env en process.env.
import { ConfigModule } from '@nestjs/config';
// MongooseModule: conecta NestJS con MongoDB mediante la librería Mongoose.
import { MongooseModule } from '@nestjs/mongoose';
import { JwtGuard } from './comun/guards/jwt.guard.js';
import { RolesGuard } from './comun/guards/roles.guard.js';
import { SaludModule } from './modulos/salud/salud.module.js';
import { AuthModule } from './modulos/auth/auth.module.js';
import { UsuariosModule } from './modulos/usuarios/usuarios.module.js';
import { ProyectosModule } from './modulos/proyectos/proyectos.module.js';
import { SpecsModule } from './modulos/specs/specs.module.js';
import { TareasModule } from './modulos/tareas/tareas.module.js';
import { RevisionesModule } from './modulos/revisiones/revisiones.module.js';
import { MetricasModule } from './modulos/metricas/metricas.module.js';
import { PromptsModule } from './modulos/prompts/prompts.module.js';

@Module({
  imports: [
    // isGlobal: las variables .env quedan disponibles en todo el proyecto.
    ConfigModule.forRoot({ isGlobal: true }),
    // forRootAsync + useFactory: lee MONGO_URI DESPUÉS de cargar el .env (no antes).
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/devhub',
      }),
    }),
    SaludModule, // GET /api/salud (lo usa el pipeline para saber si la API vive)
    AuthModule, // login y perfil
    UsuariosModule, // gestión de usuarios (ADMIN)
    ProyectosModule, // proyectos y milestones
    SpecsModule, // especificaciones SDD
    TareasModule, // tareas y Kanban
    RevisionesModule, // Pull Requests y Code Review
    MetricasModule, // dashboard
    PromptsModule, // biblioteca de prompts
  ],
  // providers con APP_GUARD: el orden importa → primero se valida el token, luego el rol.
  providers: [
    { provide: APP_GUARD, useClass: JwtGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
