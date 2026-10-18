// metricas.reglas.spec.ts → prueba TDD del criterio de aceptación de la SPEC-006 (dashboard).

import { porcentajeAvance } from './metricas.reglas.js';

describe('Métricas', () => {
  it('un milestone con 2 de 4 tareas en HECHO muestra 50 %', () => {
    expect(porcentajeAvance(4, 2)).toBe(50);
  });

  it('sin tareas el avance es 0 %', () => {
    expect(porcentajeAvance(0, 0)).toBe(0);
  });
});
