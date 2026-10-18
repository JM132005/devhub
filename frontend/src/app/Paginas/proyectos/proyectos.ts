// proyectos.ts → PANTALLA con la lista de proyectos del usuario (HU-04) y alta de proyectos (HU-03).

import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProyectosService } from '../../Servicios/proyectos.service';
import { UsuariosService } from '../../Servicios/usuarios.service';
import { AuthService } from '../../Servicios/auth.service';
import { NuevoProyecto, Proyecto } from '../../Entidades/proyecto';
import { Usuario } from '../../Entidades/usuario';
import { InsigniaEstado } from '../../Componentes/insignia-estado/insignia-estado';
import { FormularioProyecto } from '../../Formularios/formulario-proyecto/formulario-proyecto';
import { mensajeError } from '../../Utils/errores';
import { nombreDe } from '../../Utils/ids';

@Component({
  selector: 'app-proyectos',
  imports: [RouterLink, InsigniaEstado, FormularioProyecto],
  templateUrl: './proyectos.html',
})
export class Proyectos implements OnInit {
  private readonly proyectosService = inject(ProyectosService);
  private readonly usuariosService = inject(UsuariosService);
  protected readonly auth = inject(AuthService);
  protected readonly nombreDe = nombreDe;

  protected readonly proyectos = signal<Proyecto[]>([]);
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly mostrarFormulario = signal(false);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.cargar();
    this.usuariosService.listar().subscribe((lista) => this.usuarios.set(lista.filter((u) => u.rol === 'DESARROLLADOR')));
  }

  cargar(): void {
    this.proyectosService.listar().subscribe({
      next: (lista) => this.proyectos.set(lista),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }

  crear(datos: NuevoProyecto): void {
    this.proyectosService.crear(datos).subscribe({
      next: () => {
        this.mostrarFormulario.set(false);
        this.cargar();
      },
      error: (e) => this.error.set(mensajeError(e)),
    });
  }
}
