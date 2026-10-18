// usuarios.module.ts → empaqueta esquema + servicio + controlador de usuarios.

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioEsquema } from './esquemas/usuario.esquema.js';
import { UsuariosService } from './usuarios.service.js';
import { UsuariosController } from './usuarios.controller.js';

@Module({
  // forFeature: registra la colección para poder inyectar su modelo.
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioEsquema }]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService], // AuthModule lo usa para el login
})
export class UsuariosModule {}
