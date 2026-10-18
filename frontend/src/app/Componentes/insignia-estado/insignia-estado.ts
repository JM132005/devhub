// insignia-estado.ts → COMPONENTE pequeño: "pastilla" de color con el estado (Aprobada, En revisión...).
// Se reutiliza en specs, tareas, revisiones y proyectos.

import { Component, computed, input } from '@angular/core';
import { etiqueta } from '../../Utils/etiquetas';

@Component({
  selector: 'app-insignia-estado',
  // Plantilla muy corta → se deja en línea (template) en vez de un archivo .html aparte.
  template: `<span class="insignia" [class]="tono()">{{ texto() }}</span>`,
  styles: `
    .insignia { display: inline-block; font-size: .72rem; font-weight: 700; padding: 2px 9px; border-radius: 99px; white-space: nowrap; }
    .neutro { background: var(--superficie-2); color: var(--texto-suave); }
    .info { background: var(--marca-suave); color: var(--marca); }
    .alerta { background: var(--alerta-suave); color: var(--alerta); }
    .exito { background: var(--exito-suave); color: var(--exito); }
    .peligro { background: var(--peligro-suave); color: var(--peligro); }
  `,
})
export class InsigniaEstado {
  // input.required: dato OBLIGATORIO que le pasa el componente padre → <app-insignia-estado [estado]="x" />
  readonly estado = input.required<string>();

  protected readonly texto = computed(() => etiqueta(this.estado()));

  // Elige el color según el estado.
  protected readonly tono = computed(() => {
    const e = this.estado();
    if (['APROBADA', 'APROBADO', 'HECHO', 'PRODUCCION', 'IMPLEMENTADA'].includes(e)) return 'insignia exito';
    if (['EN_REVISION', 'ABIERTO', 'PRUEBAS', 'MEDIA'].includes(e)) return 'insignia alerta';
    if (['EN_PROGRESO', 'DESARROLLO'].includes(e)) return 'insignia info';
    if (['CAMBIOS_SOLICITADOS', 'ALTA'].includes(e)) return 'insignia peligro';
    return 'insignia neutro';
  });
}
