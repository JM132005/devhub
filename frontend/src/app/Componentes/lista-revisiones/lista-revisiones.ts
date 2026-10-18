// lista-revisiones.ts → COMPONENTE de Code Review (HU-13): lista de PRs y, si me toca revisar,
// la checklist para aprobar o pedir cambios.

import { Component, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Checklist, Revision } from '../../Entidades/revision';
import { InsigniaEstado } from '../insignia-estado/insignia-estado';
import { PUNTOS_CHECKLIST } from '../../Utils/etiquetas';
import { idDe } from '../../Utils/ids';

@Component({
  selector: 'app-lista-revisiones',
  // FormsModule: permite [(ngModel)] para enlazar inputs simples en ambos sentidos.
  imports: [DatePipe, FormsModule, InsigniaEstado],
  templateUrl: './lista-revisiones.html',
})
export class ListaRevisiones {
  readonly revisiones = input<Revision[]>([]);
  readonly usuarioId = input('');

  readonly aprobar = output<{ revision: Revision; checklist: Checklist; comentario: string }>();
  readonly pedirCambios = output<{ revision: Revision; comentario: string }>();

  protected readonly puntos = PUNTOS_CHECKLIST;
  // Revisión que se está respondiendo ahora (solo una a la vez).
  protected readonly abierta = signal<string | null>(null);
  protected checklist: Checklist = this.checklistVacia();
  protected comentario = '';

  // ¿Me toca revisar esta? → soy el revisor y sigue ABIERTA.
  meToca(r: Revision): boolean {
    return r.estado === 'ABIERTO' && idDe(r.revisorId) === this.usuarioId();
  }

  abrir(r: Revision): void {
    this.abierta.set(r._id);
    this.checklist = this.checklistVacia();
    this.comentario = '';
  }

  // Object.values(...).every(Boolean): true si todos los puntos están marcados.
  checklistCompleta(): boolean {
    return Object.values(this.checklist).every(Boolean);
  }

  marcar(clave: keyof Checklist, valor: boolean): void {
    this.checklist = { ...this.checklist, [clave]: valor };
  }

  private checklistVacia(): Checklist {
    return { pipelineVerde: false, cumpleSpec: false, tienePruebas: false, codigoComentado: false };
  }
}
