// token.interceptor.ts → INTERCEPTOR: "intercepta" TODAS las peticiones HTTP antes de salir.
// 1) Agrega la cabecera Authorization: Bearer <token>.
// 2) Si la API responde 401 (token vencido), cierra la sesión y manda al login.

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
// catchError: atrapa errores del Observable. throwError: vuelve a lanzar el error.
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../Servicios/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const auth = inject(AuthService);
  const token = auth.token();

  // clone(): las peticiones son inmutables; se crea una copia con la cabecera agregada.
  const conToken = token ? peticion.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : peticion;

  // siguiente(): deja continuar la petición; pipe(catchError) revisa la respuesta de error.
  return siguiente(conToken).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && token) auth.logout();
      return throwError(() => error);
    }),
  );
};
