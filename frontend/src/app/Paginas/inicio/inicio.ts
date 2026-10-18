// inicio.ts → PANTALLA de inicio: mis tareas, specs por aprobar y PRs por revisar.

import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProyectosService } from '../../Servicios/proyectos.service';
import { AuthService } from '../../Servicios/auth.service';
import { Resumen } from '../../Entidades/metricas';
import { InsigniaEstado } from '../../Componentes/insignia-estado/insignia-estado';
import { mensajeError } from '../../Utils/errores';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, InsigniaEstado],
  templateUrl: './inicio.html',
})
export class Inicio implements OnInit {
  private readonly proyectosService = inject(ProyectosService);
  protected readonly auth = inject(AuthService);

  protected readonly resumen = signal<Resumen | null>(null);
  protected readonly error = signal('');

  // ngOnInit: se ejecuta una vez cuando la pantalla se abre.
  ngOnInit(): void {
    this.proyectosService.resumen().subscribe({
      next: (r) => this.resumen.set(r),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }
}
