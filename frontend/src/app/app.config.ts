// app.config.ts → configuración global de la aplicación Angular (proveedores).

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
// provideRouter: activa la navegación entre pantallas. withComponentInputBinding: pasa los :id de la URL como input.
import { provideRouter, withComponentInputBinding } from '@angular/router';
// provideHttpClient: habilita HttpClient. withInterceptors: registra el interceptor del token.
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { tokenInterceptor } from './Controlador/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([tokenInterceptor])),
  ],
};
