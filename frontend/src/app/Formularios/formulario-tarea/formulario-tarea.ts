// formulario-tarea.ts → FORMULARIO para crear una tarea DESDE una spec aprobada (HU-09, RN-02).

import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NuevaTarea, Prioridad } from '../../Entidades/tarea';
import { Spec } from '../../Entidades/spec';
import { Milestone } from '../../Entidades/proyecto';
import { Usuario } from '../../Entidades/usuario';

@Component({
  selector: 'app-formulario-tarea',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-tarea.html',
})
export class FormularioTarea {
  readonly specsAprobadas = input<Spec[]>([]); // solo specs APROBADAS (RN-02)
  readonly equipo = input<Usuario[]>([]);
  readonly milestones = input<Milestone[]>([]);
  readonly guardar = output<NuevaTarea>();
  readonly cancelar = output<void>();

  protected readonly formulario = inject(FormBuilder).nonNullable.group({
    specId: ['', Validators.required],
    titulo: ['', Validators.required],
    asignadoId: [''],
    milestoneId: [''],
    prioridad: ['MEDIA' as Prioridad],
  });

  enviar(): void {
    if (this.formulario.invalid) return;
    const v = this.formulario.getRawValue();
    // Los campos opcionales vacíos no se envían (undefined), así la API no los valida.
    this.guardar.emit({
      specId: v.specId,
      titulo: v.titulo,
      prioridad: v.prioridad,
      asignadoId: v.asignadoId || undefined,
      milestoneId: v.milestoneId || undefined,
    });
  }
}
