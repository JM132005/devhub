// specs.service.ts → llamadas HTTP de especificaciones (SDD).

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../Utils/config';
import { DatosSpec, Spec } from '../Entidades/spec';

@Injectable({ providedIn: 'root' })
export class SpecsService {
  private readonly http = inject(HttpClient);

  listar(proyectoId: string) {
    return this.http.get<Spec[]>(`${API_URL}/proyectos/${proyectoId}/specs`);
  }

  crear(proyectoId: string, datos: DatosSpec) {
    return this.http.post<Spec>(`${API_URL}/proyectos/${proyectoId}/specs`, datos);
  }

  detalle(id: string) {
    return this.http.get<Spec>(`${API_URL}/specs/${id}`);
  }

  actualizar(id: string, datos: DatosSpec) {
    return this.http.patch<Spec>(`${API_URL}/specs/${id}`, datos);
  }

  // Acciones del flujo: enviar | aprobar | devolver (devolver exige comentario).
  accion(id: string, accion: 'enviar' | 'aprobar' | 'devolver', texto?: string) {
    return this.http.post<Spec>(`${API_URL}/specs/${id}/${accion}`, texto ? { texto } : {});
  }

  comentar(id: string, texto: string) {
    return this.http.post<Spec>(`${API_URL}/specs/${id}/comentarios`, { texto });
  }
}
