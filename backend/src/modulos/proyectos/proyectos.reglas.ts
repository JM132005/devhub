// proyectos.reglas.ts → reglas de negocio PURAS del módulo proyectos (no tocan la base de datos).
// Al estar separadas del servicio se pueden probar con TDD de forma rápida y sin MongoDB.

import type { UsuarioToken } from '../../comun/usuario-token.js';
import { mismoId } from '../../comun/utilidades.js';

// Datos mínimos de un proyecto que necesitan las reglas.
interface ProyectoBasico {
  liderId: unknown;
  miembros: unknown[];
}

// ¿Puede el usuario VER el proyecto? → ADMIN ve todo; el líder y los miembros ven el suyo.
export function tieneAcceso(
  proyecto: ProyectoBasico,
  usuario: UsuarioToken,
): boolean {
  if (usuario.rol === 'ADMIN') return true;
  // some(): true si al menos un miembro del arreglo cumple la condición.
  return (
    mismoId(proyecto.liderId, usuario.sub) ||
    proyecto.miembros.some((m) => mismoId(m, usuario.sub))
  );
}

// ¿Puede el usuario MODIFICAR el proyecto? → solo el ADMIN o el líder de ESE proyecto.
export function puedeGestionar(
  proyecto: ProyectoBasico,
  usuario: UsuarioToken,
): boolean {
  return usuario.rol === 'ADMIN' || mismoId(proyecto.liderId, usuario.sub);
}

// RN-06: un proyecto no pasa a PRODUCCION si quedan tareas sin terminar.
export function puedePasarAProduccion(tareasPendientes: number): boolean {
  return tareasPendientes === 0;
}
