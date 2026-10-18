// formulario-spec.ts → FORMULARIO para escribir o editar una especificación (HU-06 / HU-08).
// Requisitos y criterios se escriben UNO POR LÍNEA y se convierten en arreglos.

import { Component, OnInit, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatosSpec, Spec } from '../../Entidades/spec';

@Component({
  selector: 'app-formulario-spec',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-spec.html',
})
export class FormularioSpec implements OnInit {
  // Si llega "inicial" el formulario está en modo EDICIÓN.
  readonly inicial = input<Spec | null>(null);
  readonly guardar = output<DatosSpec>();
  readonly cancelar = output<void>();

  protected readonly formulario = inject(FormBuilder).nonNullable.group({
    titulo: ['', Validators.required],
    historia: ['Como [rol], quiero [acción], para [beneficio].', Validators.required],
    requisitos: ['', Validators.required],
    criterios: ['', Validators.required],
    cambio: [''],
  });

  ngOnInit(): void {
    const spec = this.inicial();
    if (spec) {
      // patchValue: rellena solo los campos indicados. join('\n'): arreglo → texto con saltos de línea.
      this.formulario.patchValue({
        titulo: spec.titulo,
        historia: spec.historia,
        requisitos: spec.requisitos.join('\n'),
        criterios: spec.criteriosAceptacion.join('\n'),
      });
    }
  }

  // Texto con saltos de línea → arreglo sin líneas vacías.
  private aLista(texto: string): string[] {
    return texto
      .split('\n') // separa por línea
      .map((l) => l.trim()) // quita espacios
      .filter((l) => l.length > 0); // descarta vacías
  }

  enviar(): void {
    if (this.formulario.invalid) return;
    const v = this.formulario.getRawValue();
    this.guardar.emit({
      titulo: v.titulo,
      historia: v.historia,
      requisitos: this.aLista(v.requisitos),
      criteriosAceptacion: this.aLista(v.criterios),
      // El motivo del cambio solo se envía al editar.
      ...(this.inicial() ? { cambio: v.cambio || 'Edición' } : {}),
    });
  }
}
