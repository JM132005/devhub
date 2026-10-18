// auth.guard.ts → GUARDS de rutas: deciden si se puede entrar a una pantalla.

import { inject } from '@angular/core';
// CanActivateFn: función que devuelve true (entra) o una ruta a la que redirigir.
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Servicios/auth.service';

// Solo usuarios conectados. Si no hay sesión → /login.
export const conectadoGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  // createUrlTree: crea la ruta de redirección.
  return auth.conectado() ? true : inject(Router).createUrlTree(['/login']);
};

// Solo ADMIN (pantalla de usuarios). Si no es admin → /inicio.
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.tieneRol('ADMIN') ? true : inject(Router).createUrlTree(['/inicio']);
};

// Si ya hay sesión, no tiene sentido ver el login → /inicio.
export const invitadoGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.conectado() ? inject(Router).createUrlTree(['/inicio']) : true;
};
