// specs.reglas.spec.ts → pruebas TDD del ciclo de vida de las specs (RN-01 y RN-05).

import {
  estadoTrasEditar,
  puedeAprobar,
  siguienteCodigo,
  siguienteEstado,
} from './specs.reglas.js';

describe('Reglas de specs', () => {
  it('una spec en BORRADOR se puede enviar a revisión', () => {
    expect(siguienteEstado('BORRADOR', 'enviar')).toBe('EN_REVISION');
  });

  it('no se puede aprobar una spec que sigue en BORRADOR', () => {
    expect(siguienteEstado('BORRADOR', 'aprobar')).toBeNull();
  });

  it('una spec EN_REVISION se aprueba o se devuelve', () => {
    expect(siguienteEstado('EN_REVISION', 'aprobar')).toBe('APROBADA');
    expect(siguienteEstado('EN_REVISION', 'devolver')).toBe('BORRADOR');
  });

  it('RN-01: solo LIDER o ADMIN aprueban', () => {
    expect(puedeAprobar('LIDER')).toBe(true);
    expect(puedeAprobar('ADMIN')).toBe(true);
    expect(puedeAprobar('DESARROLLADOR')).toBe(false);
  });

  it('RN-05: editar una spec APROBADA la regresa a EN_REVISION', () => {
    expect(estadoTrasEditar('APROBADA')).toBe('EN_REVISION');
    expect(estadoTrasEditar('BORRADOR')).toBe('BORRADOR');
    expect(estadoTrasEditar('IMPLEMENTADA')).toBeNull();
  });

  it('genera códigos consecutivos SPEC-001, SPEC-012', () => {
    expect(siguienteCodigo(0)).toBe('SPEC-001');
    expect(siguienteCodigo(11)).toBe('SPEC-012');
  });
});
