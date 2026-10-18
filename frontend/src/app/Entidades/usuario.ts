// usuario.ts → ENTIDAD: forma de un usuario tal como lo devuelve la API.
// "interface" solo existe en TypeScript: ayuda al editor a avisar si usamos mal un campo.

// Tipo unión: el rol solo puede ser uno de estos tres textos.
export type Rol = 'ADMIN' | 'LIDER' | 'DESARROLLADOR';

export interface Usuario {
  _id: string;
  nombre: string;
  correo: string;
  rol: Rol;
  activo?: boolean; // "?" = el campo puede no venir
}

// Respuesta de POST /api/auth/login
export interface RespuestaLogin {
  token: string;
  usuario: Usuario;
}

// Versión reducida que llega cuando la API hace populate (solo algunos campos).
export interface UsuarioResumen {
  _id: string;
  nombre: string;
}
