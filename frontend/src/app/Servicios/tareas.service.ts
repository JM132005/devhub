// tareas.service.ts → llamadas HTTP del tablero Kanban.

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../Utils/config';
import { EstadoTarea, NuevaTarea, Tarea } from '../Entidades/tarea';

@Injectable({ providedIn: 'root' })
export class TareasService {
  private readonly http = inject(HttpClient);

  listar(proyectoId: string) {
    return this.http.get<Tarea[]>(`${API_URL}/proyectos/${proyectoId}/tareas`);
  }

  crear(proyectoId: string, datos: NuevaTarea) {
    return this.http.post<Tarea>(`${API_URL}/proyectos/${proyectoId}/tareas`, datos);
  }

  cambiarEstado(id: string, estado: EstadoTarea) {
    return this.http.patch<Tarea>(`${API_URL}/tareas/${id}/estado`, { estado });
  }

  actualizar(id: string, datos: { rama?: string; asignadoId?: string }) {
    return this.http.patch<Tarea>(`${API_URL}/tareas/${id}`, datos);
  }
}
