// proyectos.service.ts → llamadas HTTP del módulo proyectos.
// Cada método devuelve un Observable: la petición se envía cuando alguien hace .subscribe().

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../Utils/config';
import { NuevoProyecto, Proyecto } from '../Entidades/proyecto';
import { MetricasProyecto, Resumen } from '../Entidades/metricas';

@Injectable({ providedIn: 'root' })
export class ProyectosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/proyectos`;

  listar() {
    return this.http.get<Proyecto[]>(this.url);
  }

  detalle(id: string) {
    return this.http.get<Proyecto>(`${this.url}/${id}`);
  }

  crear(datos: NuevoProyecto) {
    return this.http.post<Proyecto>(this.url, datos);
  }

  // Partial<T>: todos los campos de T pasan a ser opcionales.
  actualizar(id: string, datos: Partial<Proyecto>) {
    return this.http.patch<Proyecto>(`${this.url}/${id}`, datos);
  }

  agregarMilestone(id: string, nombre: string, fechaLimite: string) {
    return this.http.post<Proyecto>(`${this.url}/${id}/milestones`, { nombre, fechaLimite });
  }

  metricas(id: string) {
    return this.http.get<MetricasProyecto>(`${this.url}/${id}/metricas`);
  }

  resumen() {
    return this.http.get<Resumen>(`${API_URL}/metricas/resumen`);
  }
}
