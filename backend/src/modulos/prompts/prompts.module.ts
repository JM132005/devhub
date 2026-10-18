// prompts.module.ts → empaqueta la biblioteca de prompts.

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Prompt, PromptEsquema } from './esquemas/prompt.esquema.js';
import { PromptsService } from './prompts.service.js';
import { PromptsController } from './prompts.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Prompt.name, schema: PromptEsquema }]),
  ],
  controllers: [PromptsController],
  providers: [PromptsService],
})
export class PromptsModule {}
