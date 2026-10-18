// roles.decorator.ts → decorador @Roles('LIDER', 'ADMIN') para limitar una ruta a ciertos roles.

import { SetMetadata } from '@nestjs/common';
import { Rol } from '../constantes.js';

export const ROLES_PERMITIDOS = 'rolesPermitidos';

// "...roles" (parámetro rest) recibe cualquier cantidad de roles y los junta en un arreglo.
export const Roles = (...roles: Rol[]) => SetMetadata(ROLES_PERMITIDOS, roles);
