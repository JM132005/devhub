// revisiones.service.ts → llamadas HTTP de Code Review.

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../Utils/config';
import { Checklist, Revision } from '../Entidades/revision';

@Injectable({ providedIn: 'root' })
export class RevisionesService {
  private readonly http = inject(HttpClient);

  listar(proyectoId: string) {
    return this.http.get<Revision[]>(`${API_URL}/proyectos/${proyectoId}/revisiones`);
  }

  registrar(tareaId: string, urlPr: string, revisorId: string) {
    return this.http.post<Revision>(`${API_URL}/tareas/${tareaId}/revisiones`, { urlPr, revisorId });
  }

  aprobar(id: string, checklist: Checklist, comentario: string) {
    return this.http.post<Revision>(`${API_URL}/revisiones/${id}/aprobar`, { checklist, comentario });
  }

  solicitarCambios(id: string, comentario: string) {
    return this.http.post<Revision>(`${API_URL}/revisiones/${id}/solicitar-cambios`, { comentario });
  }
}
