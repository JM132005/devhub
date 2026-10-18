// tablero-kanban.ts → COMPONENTE del tablero Kanban (HU-10): 4 columnas con tarjetas que se mueven.
// No llama a la API: solo AVISA al padre (outputs) qué quiere hacer el usuario.

import { Component, computed, input, output } from '@angular/core';
import { EstadoTarea, Tarea } from '../../Entidades/tarea';
import { COLUMNAS_KANBAN, etiqueta } from '../../Utils/etiquetas';
import { InsigniaEstado } from '../insignia-estado/insignia-estado';
import { idDe } from '../../Utils/ids';

@Component({
  selector: 'app-tablero-kanban',
  imports: [InsigniaEstado],
  templateUrl: './tablero-kanban.html',
  styleUrl: './tablero-kanban.css',
})
export class TableroKanban {
  readonly tareas = input<Tarea[]>([]);
  readonly usuarioId = input<string>(''); // quién está conectado
  readonly esGestor = input(false); // líder del proyecto o ADMIN

  // Eventos hacia el padre.
  readonly mover = output<{ tarea: Tarea; estado: EstadoTarea }>();
  readonly registrarPr = output<Tarea>();

  protected readonly columnas = COLUMNAS_KANBAN;
  protected readonly etiqueta = etiqueta;

  // computed: agrupa las tareas por columna → { POR_HACER: [...], EN_PROGRESO: [...], ... }
  protected readonly porColumna = computed(() => {
    const grupos: Record<string, Tarea[]> = {};
    for (const c of this.columnas) grupos[c] = [];
    for (const t of this.tareas()) grupos[t.estado]?.push(t);
    return grupos;
  });

  // ¿Puede el usuario mover esta tarjeta? → el responsable o el líder.
  puedeMover(t: Tarea): boolean {
    return this.esGestor() || idDe(t.asignadoId) === this.usuarioId();
  }

  // Columna anterior o siguiente (null si está en un extremo).
  vecina(estado: EstadoTarea, paso: -1 | 1): EstadoTarea | null {
    const i = this.columnas.indexOf(estado) + paso;
    return this.columnas[i] ?? null;
  }

  esMia(t: Tarea): boolean {
    return idDe(t.asignadoId) === this.usuarioId();
  }
}
