// errores.ts → convierte un error HTTP en un mensaje legible para mostrar en pantalla.

import { HttpErrorResponse } from '@angular/common/http';

export function mensajeError(error: unknown): string {
  // instanceof: comprueba si el error es una respuesta HTTP de Angular.
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return 'No hay conexión con la API. ¿Está encendido el backend (npm run start:dev)?';
    const mensaje = error.error?.message;
    // NestJS devuelve un texto o un arreglo de textos (cuando fallan varias validaciones).
    if (Array.isArray(mensaje)) return mensaje.join(' · ');
    if (typeof mensaje === 'string') return mensaje;
  }
  return 'Ocurrió un error inesperado';
}
