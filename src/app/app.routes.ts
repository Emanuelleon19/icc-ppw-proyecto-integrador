import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { programmerGuard } from './core/guards/programmer.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'programmer/:slug',
    loadComponent: () =>
      import('./features/programmer-profile/programmer-profile.component').then(
        (m) => m.ProgrammerProfileComponent
      ),
  },
  {
    path: 'auth/login',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/register',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./features/auth/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'contact',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/contact-request/contact-form.component').then(
        (m) => m.ContactFormComponent
      ),
  },
  {
    path: 'dashboard/my-requests',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/requests-list.component').then(
        (m) => m.RequestsListComponent
      ),
  },
  {
  path: 'dashboard/received-requests',
  canActivate: [programmerGuard],
  loadComponent: () =>
    import('./features/dashboard/requests-list.component').then(
      (m) => m.RequestsListComponent 
    ),
},
  {
    path: '**',
    redirectTo: '',
  },
];