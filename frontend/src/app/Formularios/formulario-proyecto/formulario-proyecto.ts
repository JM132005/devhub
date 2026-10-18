// formulario-proyecto.ts → FORMULARIO para crear un proyecto y elegir su equipo (HU-03).

import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NuevoProyecto } from '../../Entidades/proyecto';
import { Usuario } from '../../Entidades/usuario';

@Component({
  selector: 'app-formulario-proyecto',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-proyecto.html',
})
export class FormularioProyecto {
  // input: lista de usuarios para elegir el equipo. output: evento que avisa al padre.
  readonly usuarios = input<Usuario[]>([]);
  readonly guardar = output<NuevoProyecto>();
  readonly cancelar = output<void>();

  protected readonly formulario = inject(FormBuilder).nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    cliente: [''],
    // pattern: formato usuario/repositorio (o vacío)
    repoGithub: ['', Validators.pattern(/^$|^[\w.-]+\/[\w.-]+$/)],
  });

  // Conjunto (Set) con los ids de los miembros marcados: evita duplicados.
  protected readonly miembros = signal(new Set<string>());

  alternarMiembro(id: string): void {
    // update(): calcula el nuevo valor a partir del anterior.
    this.miembros.update((actual) => {
      const copia = new Set(actual);
      copia.has(id) ? copia.delete(id) : copia.add(id);
      return copia;
    });
  }

  enviar(): void {
    if (this.formulario.invalid) return;
    // emit(): dispara el evento con los datos; el padre decide qué hacer (llamar a la API).
    this.guardar.emit({ ...this.formulario.getRawValue(), miembros: [...this.miembros()] });
  }
}
