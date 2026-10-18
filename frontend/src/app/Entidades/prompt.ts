// prompt.ts → ENTIDAD de un prompt de la biblioteca para Copilot.

import { UsuarioResumen } from './usuario';

export type CategoriaPrompt = 'TESTING' | 'DOCUMENTACION' | 'REFACTOR' | 'CODIGO';

export interface Prompt {
  _id: string;
  titulo: string;
  categoria: CategoriaPrompt;
  contenido: string;
  etiquetas: string[];
  autorId: UsuarioResumen | null;
  votos: number;
}
