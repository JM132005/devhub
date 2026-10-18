// prompts.service.ts → biblioteca de prompts para GitHub Copilot.

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prompt, PromptDocumento } from './esquemas/prompt.esquema.js';
import { CrearPromptDto } from './dto/crear-prompt.dto.js';
import type { UsuarioToken } from '../../comun/usuario-token.js';

@Injectable()
export class PromptsService {
  constructor(
    @InjectModel(Prompt.name)
    private readonly promptModelo: Model<PromptDocumento>,
  ) {}

  // Busca por categoría y/o texto; los más votados primero.
  listar(categoria?: string, texto?: string) {
    const filtro: Record<string, unknown> = {};
    if (categoria) filtro['categoria'] = categoria;
    // $regex con opción 'i': busca el texto dentro del título sin importar mayúsculas.
    // replace(): escapa caracteres especiales para que el texto se busque literal.
    if (texto)
      filtro['titulo'] = {
        $regex: texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        $options: 'i',
      };
    return this.promptModelo
      .find(filtro)
      .populate('autorId', 'nombre')
      .sort({ votos: -1 })
      .exec();
  }

  crear(dto: CrearPromptDto, usuario: UsuarioToken) {
    return this.promptModelo.create({ ...dto, autorId: usuario.sub });
  }

  // $inc: suma 1 al campo votos de forma atómica (segura si votan dos a la vez).
  async votar(id: string) {
    const prompt = await this.promptModelo
      .findByIdAndUpdate(
        id,
        { $inc: { votos: 1 } },
        { returnDocument: 'after' },
      )
      .exec();
    if (!prompt) throw new NotFoundException('Prompt no encontrado');
    return prompt;
  }
}
