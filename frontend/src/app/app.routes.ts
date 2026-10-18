// app.routes.ts → RUTAS: qué pantalla se muestra según la URL.
// loadComponent: carga la pantalla solo cuando se visita ("lazy loading" → la app abre más rápido).

import { Routes } from '@angular/router';
import { adminGuard, conectadoGuard, invitadoGuard } from './Controlador/auth.guard';

export const routes: Routes = [
  { path: 'login', canActivate: [invitadoGuard], loadComponent: () => import('./Paginas/login/login').then((m) => m.Login) },
  {
    path: '',
    canActivate: [conectadoGuard], // todo lo de adentro exige sesión
    children: [
      { path: 'inicio', loadComponent: () => import('./Paginas/inicio/inicio').then((m) => m.Inicio) },
      { path: 'proyectos', loadComponent: () => import('./Paginas/proyectos/proyectos').then((m) => m.Proyectos) },
      // :id → parámetro de la URL que llega como input "id" al componente.
      {
        path: 'proyectos/:id',
        loadComponent: () => import('./Paginas/proyecto-detalle/proyecto-detalle').then((m) => m.ProyectoDetalle),
      },
      { path: 'specs/:id', loadComponent: () => import('./Paginas/spec-detalle/spec-detalle').then((m) => m.SpecDetalle) },
      { path: 'prompts', loadComponent: () => import('./Paginas/prompts/prompts').then((m) => m.Prompts) },
      {
        path: 'usuarios',
        canActivate: [adminGuard],
        loadComponent: () => import('./Paginas/usuarios/usuarios').then((m) => m.Usuarios),
      },
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
    ],
  },
  { path: '**', redirectTo: 'inicio' }, // cualquier URL desconocida
];
