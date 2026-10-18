// formulario-revision.ts → FORMULARIO para registrar el Pull Request de una tarea (HU-12).

import { Component, OnInit, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tarea } from '../../Entidades/tarea';
import { Usuario } from '../../Entidades/usuario';

@Component({
  selector: 'app-formulario-revision',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-revision.html',
})
export class FormularioRevision implements OnInit {
  readonly tarea = input.required<Tarea>();
  readonly revisores = input<Usuario[]>([]); // equipo SIN el autor (RN-04)
  readonly repoGithub = input(''); // para sugerir la URL del PR
  readonly guardar = output<{ urlPr: string; revisorId: string; rama: string }>();
  readonly cancelar = output<void>();

  protected readonly formulario = inject(FormBuilder).nonNullable.group({
    rama: ['', [Validators.required, Validators.pattern(/^(feat|fix|docs|test|ci)\/[\w.-]+$/)]],
    urlPr: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    revisorId: ['', Validators.required],
  });

  ngOnInit(): void {
    // Sugerencias: la rama ya registrada y la URL base de los PR del repositorio.
    this.formulario.patchValue({
      rama: this.tarea().rama ?? '',
      urlPr: this.repoGithub() ? `https://github.com/${this.repoGithub()}/pull/` : '',
    });
  }

  enviar(): void {
    if (this.formulario.valid) this.guardar.emit(this.formulario.getRawValue());
  }
}
