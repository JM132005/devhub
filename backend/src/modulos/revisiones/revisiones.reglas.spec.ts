// revisiones.reglas.spec.ts → pruebas TDD de RN-04 y de la checklist.

import { checklistCompleta, revisorValido } from './revisiones.reglas.js';

describe('Reglas de revisiones', () => {
  it('RN-04: el autor no puede revisarse a sí mismo', () => {
    expect(revisorValido('u1', 'u1')).toBe(false);
    expect(revisorValido('u1', 'u2')).toBe(true);
  });

  it('solo se aprueba con la checklist completa', () => {
    const completa = {
      pipelineVerde: true,
      cumpleSpec: true,
      tienePruebas: true,
      codigoComentado: true,
    };
    expect(checklistCompleta(completa)).toBe(true);
    expect(checklistCompleta({ ...completa, tienePruebas: false })).toBe(false);
  });
});
