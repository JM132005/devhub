// prompts.ts → PANTALLA de la biblioteca de prompts para GitHub Copilot (HU-16).

import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PromptsService } from '../../Servicios/prompts.service';
import { CategoriaPrompt, Prompt } from '../../Entidades/prompt';
import { mensajeError } from '../../Utils/errores';

@Component({
  selector: 'app-prompts',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './prompts.html',
})
export class Prompts implements OnInit {
  private readonly promptsService = inject(PromptsService);

  protected readonly categorias: CategoriaPrompt[] = ['TESTING', 'DOCUMENTACION', 'REFACTOR', 'CODIGO'];
  protected readonly prompts = signal<Prompt[]>([]);
  protected readonly categoria = signal('');
  protected readonly copiado = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly error = signal('');
  protected busqueda = '';

  protected readonly formulario = inject(FormBuilder).nonNullable.group({
    titulo: ['', Validators.required],
    categoria: ['TESTING' as CategoriaPrompt],
    contenido: ['', Validators.required],
    etiquetas: [''],
  });

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.promptsService.listar(this.categoria(), this.busqueda).subscribe({
      next: (lista) => this.prompts.set(lista),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }

  filtrar(cat: string): void {
    this.categoria.set(this.categoria() === cat ? '' : cat); // clic otra vez = quitar filtro
    this.buscar();
  }

  // navigator.clipboard: API del navegador para copiar texto al portapapeles.
  async copiar(p: Prompt): Promise<void> {
    try {
      await navigator.clipboard.writeText(p.contenido);
      this.copiado.set(p._id);
      setTimeout(() => this.copiado.set(null), 1500); // el aviso "Copiado" dura 1.5 s
    } catch {
      this.error.set('No se pudo copiar; selecciona el texto manualmente.');
    }
  }

  votar(p: Prompt): void {
    this.promptsService.votar(p._id).subscribe(() => this.buscar());
  }

  guardar(): void {
    if (this.formulario.invalid) return;
    const v = this.formulario.getRawValue();
    const etiquetas = v.etiquetas.split(',').map((e) => e.trim()).filter(Boolean); // "a, b" → ['a','b']
    this.promptsService.crear({ ...v, etiquetas }).subscribe({
      next: () => {
        this.formulario.reset();
        this.mostrarFormulario.set(false);
        this.buscar();
      },
      error: (e) => this.error.set(mensajeError(e)),
    });
  }
}
