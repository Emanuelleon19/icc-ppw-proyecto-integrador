import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { programmerGuard } from './core/guards/programmer.guard';
import { publicGuard } from './core/guards/public.guard';

/**
 * Configuración de rutas de la aplicación.
 * Define la navegación entre páginas y aplica
 * restricciones de acceso mediante guards.
 */
export const routes: Routes = [

  // Página principal
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },

  // Perfil público de un programador
  {
    path: 'programmer/:slug',
    loadComponent: () =>
      import('./features/programmer-profile/programmer-profile.component').then(
        (m) => m.ProgrammerProfileComponent
      ),
  },

  // Inicio de sesión (solo para usuarios no autenticados)
  {
    path: 'auth/login',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
  },

  // Registro de usuarios (solo para usuarios no autenticados)
  {
    path: 'auth/register',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./features/auth/register.component').then(
        (m) => m.RegisterComponent
      ),
  },

  // Formulario para enviar solicitudes de contacto
  {
    path: 'contact',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/contact-request/contact-form.component').then(
        (m) => m.ContactFormComponent
      ),
  },

  // Panel donde los usuarios visualizan sus solicitudes enviadas
  {
    path: 'dashboard/my-requests',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/requests-list.component').then(
        (m) => m.RequestsListComponent
      ),
  },

  // Panel exclusivo para programadores con solicitudes recibidas
  {
    path: 'dashboard/received-requests',
    canActivate: [programmerGuard],
    loadComponent: () =>
      import('./features/dashboard/requests-list.component').then(
        (m) => m.RequestsListComponent
      ),
  },

  // Redirección para rutas no existentes
  {
    path: '**',
    redirectTo: '',
  },
];