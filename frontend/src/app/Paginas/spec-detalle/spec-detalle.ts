// spec-detalle.ts → PANTALLA de una especificación: ver, editar, enviar, aprobar/devolver,
// comentar y revisar su historial de versiones (HU-06, HU-07, HU-08).

import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpecsService } from '../../Servicios/specs.service';
import { AuthService } from '../../Servicios/auth.service';
import { DatosSpec, Spec } from '../../Entidades/spec';
import { InsigniaEstado } from '../../Componentes/insignia-estado/insignia-estado';
import { FormularioSpec } from '../../Formularios/formulario-spec/formulario-spec';
import { mensajeError } from '../../Utils/errores';

@Component({
  selector: 'app-spec-detalle',
  imports: [RouterLink, DatePipe, FormsModule, InsigniaEstado, FormularioSpec],
  templateUrl: './spec-detalle.html',
})
export class SpecDetalle implements OnInit {
  readonly id = input.required<string>(); // /specs/:id

  private readonly specsService = inject(SpecsService);
  protected readonly auth = inject(AuthService);

  protected readonly spec = signal<Spec | null>(null);
  protected readonly editando = signal(false);
  protected readonly error = signal('');
  protected readonly exito = signal('');
  protected comentario = '';

  // RN-01 en la interfaz: solo LIDER o ADMIN ven los botones de aprobar/devolver.
  protected readonly puedeAprobar = computed(() => this.auth.tieneRol('LIDER', 'ADMIN'));

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.specsService.detalle(this.id()).subscribe({
      next: (s) => this.spec.set(s),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }

  // Función común para las respuestas: guarda la spec nueva y muestra mensaje.
  private responder(mensaje: string) {
    return {
      next: () => {
        this.error.set('');
        this.exito.set(mensaje);
        this.comentario = '';
        this.editando.set(false);
        this.spec.set(null); // fuerza recarga con populate completo
        this.cargar();
      },
      error: (e: unknown) => {
        this.exito.set('');
        this.error.set(mensajeError(e));
      },
    };
  }

  enviar(): void {
    this.specsService.accion(this.id(), 'enviar').subscribe(this.responder('Spec enviada a revisión.'));
  }

  aprobar(): void {
    this.specsService.accion(this.id(), 'aprobar').subscribe(this.responder('Spec APROBADA ✔ Ya se pueden crear tareas.'));
  }

  devolver(): void {
    if (!this.comentario.trim()) {
      this.error.set('Escribe un comentario explicando qué debe corregirse.');
      return;
    }
    this.specsService.accion(this.id(), 'devolver', this.comentario).subscribe(this.responder('Spec devuelta a BORRADOR.'));
  }

  comentar(): void {
    if (!this.comentario.trim()) return;
    this.specsService.comentar(this.id(), this.comentario).subscribe(this.responder('Comentario agregado.'));
  }

  guardarEdicion(datos: DatosSpec): void {
    this.specsService.actualizar(this.id(), datos).subscribe(this.responder('Cambios guardados como nueva versión.'));
  }
}
