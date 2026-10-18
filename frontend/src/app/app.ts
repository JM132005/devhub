// app.ts → componente RAÍZ: el "marco" de la app (menú + zona donde cambian las pantallas).

import { Component, inject } from '@angular/core';
// RouterOutlet: lugar donde Angular dibuja la pantalla de la ruta actual.
import { RouterOutlet } from '@angular/router';
import { MenuPrincipal } from './Componentes/menu-principal/menu-principal';
import { AuthService } from './Servicios/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuPrincipal], // componentes que usa la plantilla
  templateUrl: './app.html',
})
export class App {
  // protected: accesible desde la plantilla HTML pero no desde otras clases.
  protected readonly auth = inject(AuthService);
}
