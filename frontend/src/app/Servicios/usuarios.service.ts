// usuarios.service.ts → llamadas HTTP de usuarios (la gestión es solo para ADMIN).

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../Utils/config';
import { Rol, Usuario } from '../Entidades/usuario';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/usuarios`;

  listar() {
    return this.http.get<Usuario[]>(this.url);
  }

  crear(datos: { nombre: string; correo: string; contrasena: string; rol: Rol }) {
    return this.http.post<Usuario>(this.url, datos);
  }

  actualizar(id: string, datos: { rol?: Rol; activo?: boolean }) {
    return this.http.patch<Usuario>(`${this.url}/${id}`, datos);
  }
}
