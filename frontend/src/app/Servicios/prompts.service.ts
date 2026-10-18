// prompts.service.ts → llamadas HTTP de la biblioteca de prompts.

import { Injectable, inject } from '@angular/core';
// HttpParams: arma los parámetros de la URL (?categoria=...&q=...) de forma segura.
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from '../Utils/config';
import { CategoriaPrompt, Prompt } from '../Entidades/prompt';

@Injectable({ providedIn: 'root' })
export class PromptsService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/prompts`;

  listar(categoria: string, texto: string) {
    let params = new HttpParams();
    if (categoria) params = params.set('categoria', categoria);
    if (texto) params = params.set('q', texto);
    return this.http.get<Prompt[]>(this.url, { params });
  }

  crear(datos: { titulo: string; categoria: CategoriaPrompt; contenido: string; etiquetas: string[] }) {
    return this.http.post<Prompt>(this.url, datos);
  }

  votar(id: string) {
    return this.http.post<Prompt>(`${this.url}/${id}/votar`, {});
  }
}
