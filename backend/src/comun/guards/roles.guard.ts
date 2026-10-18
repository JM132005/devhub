// roles.guard.ts → GUARD de autorización: si la ruta tiene @Roles(...), revisa que el rol del usuario esté permitido.
// Se ejecuta DESPUÉS del JwtGuard (por eso ya existe request.usuario).

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_PERMITIDOS } from '../decoradores/roles.decorator.js';
import { Rol } from '../constantes.js';
import type { UsuarioToken } from '../usuario-token.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(contexto: ExecutionContext): boolean {
    // Arreglo de roles permitidos que puso el decorador @Roles (o undefined si la ruta no lo usa).
    const permitidos = this.reflector.getAllAndOverride<Rol[]>(
      ROLES_PERMITIDOS,
      [contexto.getHandler(), contexto.getClass()],
    );
    if (!permitidos || permitidos.length === 0) return true; // ruta sin restricción de rol

    const usuario = contexto
      .switchToHttp()
      .getRequest<{ usuario?: UsuarioToken }>().usuario;
    // includes(): true si el rol del usuario está dentro del arreglo de permitidos.
    if (usuario && permitidos.includes(usuario.rol)) return true;
    throw new ForbiddenException(
      `Solo pueden hacer esto: ${permitidos.join(', ')}`,
    );
  }
}
