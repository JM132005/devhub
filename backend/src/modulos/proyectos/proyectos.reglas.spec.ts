// proyectos.reglas.spec.ts → pruebas TDD de las reglas de proyectos (incluye RN-06).

import {
  puedeGestionar,
  puedePasarAProduccion,
  tieneAcceso,
} from './proyectos.reglas.js';
import type { UsuarioToken } from '../../comun/usuario-token.js';

// Función auxiliar que crea usuarios de prueba rápido.
const usuario = (sub: string, rol: UsuarioToken['rol']): UsuarioToken => ({
  sub,
  rol,
  correo: 'x@x.com',
  nombre: 'X',
});
const proyecto = { liderId: 'lider1', miembros: ['dev1'] };

describe('Reglas de proyectos', () => {
  it('el ADMIN accede a cualquier proyecto', () => {
    expect(tieneAcceso(proyecto, usuario('otro', 'ADMIN'))).toBe(true);
  });

  it('un miembro accede, un extraño no', () => {
    expect(tieneAcceso(proyecto, usuario('dev1', 'DESARROLLADOR'))).toBe(true);
    expect(tieneAcceso(proyecto, usuario('dev9', 'DESARROLLADOR'))).toBe(false);
  });

  it('solo el líder del proyecto o el ADMIN lo gestionan', () => {
    expect(puedeGestionar(proyecto, usuario('lider1', 'LIDER'))).toBe(true);
    expect(puedeGestionar(proyecto, usuario('lider2', 'LIDER'))).toBe(false);
    expect(puedeGestionar(proyecto, usuario('dev1', 'DESARROLLADOR'))).toBe(
      false,
    );
  });

  it('RN-06: no pasa a producción con tareas pendientes', () => {
    expect(puedePasarAProduccion(3)).toBe(false);
    expect(puedePasarAProduccion(0)).toBe(true);
  });
});
