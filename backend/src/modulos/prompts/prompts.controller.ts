// prompts.controller.ts → rutas /api/prompts

import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsuarioActual } from '../../comun/decoradores/usuario-actual.decorator.js';
import { IdMongoPipe } from '../../comun/pipes/id-mongo.pipe.js';
import type { UsuarioToken } from '../../comun/usuario-token.js';
import { PromptsService } from './prompts.service.js';
import { CrearPromptDto } from './dto/crear-prompt.dto.js';

@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  // GET /api/prompts?categoria=TESTING&q=pruebas
  @Get()
  listar(@Query('categoria') categoria?: string, @Query('q') texto?: string) {
    return this.promptsService.listar(categoria, texto);
  }

  // POST /api/prompts
  @Post()
  crear(@Body() dto: CrearPromptDto, @UsuarioActual() u: UsuarioToken) {
    return this.promptsService.crear(dto, u);
  }

  // POST /api/prompts/:id/votar
  @HttpCode(200)
  @Post(':id/votar')
  votar(@Param('id', IdMongoPipe) id: string) {
    return this.promptsService.votar(id);
  }
}
