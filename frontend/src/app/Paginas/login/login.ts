// login.ts → PANTALLA de inicio de sesión.

import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
// ReactiveFormsModule: formularios controlados desde TypeScript. FormBuilder: crea los controles. Validators: reglas.
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Servicios/auth.service';
import { mensajeError } from '../../Utils/errores';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // nonNullable: los campos nunca valen null (vacío = '').
  protected readonly formulario = inject(FormBuilder).nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required],
  });

  protected readonly cargando = signal(false);
  protected readonly error = signal('');

  // Usuarios de prueba del seed (para la demo; se quitan en producción).
  protected readonly demo = ['lider@devhub.com', 'diego@devhub.com', 'ana@devhub.com', 'admin@devhub.com'];

  // Rellena el formulario con un usuario de prueba.
  usarDemo(correo: string): void {
    this.formulario.setValue({ correo, contrasena: 'Devhub123*' });
  }

  entrar(): void {
    if (this.formulario.invalid) return;
    this.cargando.set(true);
    this.error.set('');
    // getRawValue(): obtiene { correo, contrasena } del formulario.
    const { correo, contrasena } = this.formulario.getRawValue();
    // subscribe: envía la petición; next = respuesta OK, error = respuesta con error.
    this.auth.login(correo, contrasena).subscribe({
      next: () => this.router.navigate(['/inicio']),
      error: (e) => {
        this.error.set(mensajeError(e));
        this.cargando.set(false);
      },
    });
  }
}
