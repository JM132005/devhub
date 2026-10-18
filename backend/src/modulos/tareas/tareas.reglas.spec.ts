// tareas.reglas.spec.ts → pruebas TDD de RN-02 y RN-03.

import {
  puedeCrearTarea,
  puedeMoverA,
  specCompletada,
  asignarResponsable
} from './tareas.reglas.js';

describe('Reglas de tareas', () => {
  it('RN-02: solo se crean tareas desde specs APROBADAS', () => {
    expect(puedeCrearTarea('APROBADA')).toBe(true);
    expect(puedeCrearTarea('BORRADOR')).toBe(false);
    expect(puedeCrearTarea('EN_REVISION')).toBe(false);
  });

  it('RN-03: no se mueve a HECHO sin PR aprobado', () => {
    expect(puedeMoverA('HECHO', false)).toBe(false);
    expect(puedeMoverA('HECHO', true)).toBe(true);
  });

  it('las demás columnas se pueden usar libremente', () => {
    expect(puedeMoverA('EN_PROGRESO', false)).toBe(true);
  });

  it('la spec se completa cuando todas sus tareas están en HECHO', () => {
    expect(specCompletada(['HECHO', 'HECHO'])).toBe(true);
    expect(specCompletada(['HECHO', 'EN_PROGRESO'])).toBe(false);
    expect(specCompletada([])).toBe(false);
  });

  it('Issue 16: debe cambiar el responsable si el usuario es válido', () => {
    const tarea = { id: 1, responsable: 'Juan' };
    const resultado = asignarResponsable(tarea, 'Sandy');
    expect(resultado.responsable).toBe('Sandy');
  });

  it('Issue 16: debe lanzar error si el usuario no es válido', () => {
    const tarea = { id: 1, responsable: 'Juan' };
    expect(() => asignarResponsable(tarea, '')).toThrowError('Usuario no válido');
  });
});


