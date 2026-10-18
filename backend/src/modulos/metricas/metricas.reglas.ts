// metricas.reglas.ts → cálculos PUROS del dashboard.

// Porcentaje de avance redondeado: 2 de 4 → 50. Si no hay tareas → 0 (evita dividir entre cero).
export function porcentajeAvance(total: number, hechas: number): number {
  return total === 0 ? 0 : Math.round((hechas / total) * 100);
}
