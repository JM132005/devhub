// menu-principal.ts → COMPONENTE del menú: barra lateral en computadora, barra inferior en celular.

import { Component, inject } from '@angular/core';
// RouterLink: enlaces internos sin recargar la página. RouterLinkActive: marca el enlace de la pantalla actual.
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Servicios/auth.service';
import { etiqueta } from '../../Utils/etiquetas';

@Component({
  selector: 'app-menu-principal',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu-principal.html',
  styleUrl: './menu-principal.css',
})
export class MenuPrincipal {
  protected readonly auth = inject(AuthService);
  protected readonly etiqueta = etiqueta; // se expone la función para usarla en el HTML

  // Arreglo de enlaces del menú. "soloAdmin" oculta Usuarios a quien no es ADMIN.
  protected readonly enlaces = [
    { ruta: '/inicio', icono: '🏠', texto: 'Inicio', soloAdmin: false },
    { ruta: '/proyectos', icono: '📁', texto: 'Proyectos', soloAdmin: false },
    { ruta: '/prompts', icono: '💡', texto: 'Prompts', soloAdmin: false },
    { ruta: '/usuarios', icono: '👥', texto: 'Usuarios', soloAdmin: true },
  ];
}
