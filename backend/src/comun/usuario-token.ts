// usuario-token.ts → forma de los datos que viajan DENTRO del token JWT.
// Cada petición protegida trae el token; el JwtGuard lo descifra y deja este objeto en request.usuario.

import { Rol } from './constantes.js';

export interface UsuarioToken {
  sub: string; // "subject": el _id del usuario en MongoDB (nombre estándar en JWT)
  correo: string;
  nombre: string;
  rol: Rol;
}
