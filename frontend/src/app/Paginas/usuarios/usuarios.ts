// usuarios.ts → PANTALLA de gestión de usuarios, solo ADMIN (HU-02).

import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../../Servicios/usuarios.service';
import { Rol, Usuario } from '../../Entidades/usuario';
import { etiqueta } from '../../Utils/etiquetas';
import { mensajeError } from '../../Utils/errores';

@Component({
  selector: 'app-usuarios',
  imports: [ReactiveFormsModule],
  templateUrl: './usuarios.html',
})
export class Usuarios implements OnInit {
  private readonly usuariosService = inject(UsuariosService);
  protected readonly etiqueta = etiqueta;
  protected readonly roles: Rol[] = ['ADMIN', 'LIDER', 'DESARROLLADOR'];

  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly error = signal('');
  protected readonly exito = signal('');

  protected readonly formulario = inject(FormBuilder).nonNullable.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(8)]],
    rol: ['DESARROLLADOR' as Rol],
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.usuariosService.listar().subscribe({
      next: (lista) => this.usuarios.set(lista),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }

  crear(): void {
    if (this.formulario.invalid) return;
    this.usuariosService.crear(this.formulario.getRawValue()).subscribe({
      next: (u) => {
        this.exito.set(`Usuario ${u.correo} creado.`);
        this.error.set('');
        this.formulario.reset();
        this.cargar();
      },
      error: (e) => this.error.set(mensajeError(e)),
    });
  }

  cambiarRol(u: Usuario, rol: string): void {
    this.usuariosService.actualizar(u._id, { rol: rol as Rol }).subscribe({ next: () => this.cargar(), error: (e) => this.error.set(mensajeError(e)) });
  }

  alternarActivo(u: Usuario): void {
    this.usuariosService.actualizar(u._id, { activo: !u.activo }).subscribe({ next: () => this.cargar(), error: (e) => this.error.set(mensajeError(e)) });
  }
}
