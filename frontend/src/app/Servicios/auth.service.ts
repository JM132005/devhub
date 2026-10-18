// auth.service.ts → SERVICIO de sesión: inicia/cierra sesión y recuerda quién está conectado.

// Injectable: permite que Angular cree UNA sola instancia y la comparta (providedIn: 'root').
// signal / computed: valores reactivos; cuando cambian, la pantalla se actualiza sola.
import { Injectable, computed, inject, signal } from '@angular/core';
// HttpClient: cliente de Angular para hacer peticiones HTTP.
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
// tap: operador de RxJS que ejecuta algo con la respuesta sin modificarla.
import { Observable, tap } from 'rxjs';
import { API_URL, CLAVE_SESION } from '../Utils/config';
import { RespuestaLogin, Rol, Usuario } from '../Entidades/usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // inject(): forma moderna de pedirle a Angular una dependencia.
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Estado de la sesión (privado y modificable solo aquí).
  private readonly sesion = signal<RespuestaLogin | null>(this.leerSesionGuardada());

  // computed: valores derivados que se recalculan solos cuando cambia "sesion".
  readonly usuario = computed<Usuario | null>(() => this.sesion()?.usuario ?? null);
  readonly token = computed<string | null>(() => this.sesion()?.token ?? null);
  readonly conectado = computed(() => this.token() !== null);

  // POST /api/auth/login → guarda token y usuario.
  login(correo: string, contrasena: string): Observable<RespuestaLogin> {
    return this.http.post<RespuestaLogin>(`${API_URL}/auth/login`, { correo, contrasena }).pipe(
      tap((respuesta) => {
        this.sesion.set(respuesta); // set(): cambia el valor del signal
        this.guardarSesion(respuesta);
      }),
    );
  }

  logout(): void {
    this.sesion.set(null);
    this.guardarSesion(null);
    this.router.navigate(['/login']); // navigate: cambia de pantalla
  }

  // ¿El usuario conectado tiene alguno de estos roles?  ej: tieneRol('LIDER', 'ADMIN')
  tieneRol(...roles: Rol[]): boolean {
    const u = this.usuario();
    return u !== null && roles.includes(u.rol);
  }

  // ---------- localStorage: la sesión sobrevive al recargar la página ----------
  // try/catch: en modo incógnito o con almacenamiento bloqueado, localStorage puede fallar.
  private leerSesionGuardada(): RespuestaLogin | null {
    try {
      const texto = localStorage.getItem(CLAVE_SESION);
      return texto ? (JSON.parse(texto) as RespuestaLogin) : null; // JSON.parse: texto → objeto
    } catch {
      return null;
    }
  }

  private guardarSesion(valor: RespuestaLogin | null): void {
    try {
      if (valor) localStorage.setItem(CLAVE_SESION, JSON.stringify(valor)); // objeto → texto
      else localStorage.removeItem(CLAVE_SESION);
    } catch {
      /* si no se puede guardar, la sesión dura hasta recargar */
    }
  }
}
