import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="navbar bg-base-100 shadow-sm px-4">
      <div class="flex-1">
        <a routerLink="/" class="text-xl font-bold text-primary">
          &lt;DevPortfolio /&gt;
        </a>
      </div>

      <!-- MENU DESKTOP -->
      <div class="hidden md:flex flex-none gap-2">
        <a routerLink="/" class="btn btn-ghost btn-sm">Inicio</a>
        @if (authService.currentUser()) {
          @if (isProgrammer()) {
            <a routerLink="/dashboard/received-requests" class="btn btn-ghost btn-sm">
              Solicitudes recibidas
            </a>
          } @else {
            <a routerLink="/dashboard/my-requests" class="btn btn-ghost btn-sm">
              Mis solicitudes
            </a>
          }
          <button class="btn btn-outline btn-sm" (click)="logout()">
            Cerrar sesión
          </button>
        } @else {
          <a routerLink="/auth/login" class="btn btn-ghost btn-sm">Iniciar sesión</a>
          <a routerLink="/auth/register" class="btn btn-primary btn-sm">Registrarse</a>
        }
      </div>

      <!-- MENU MOBILE -->
      <div class="flex md:hidden">
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow mt-1">
            <li><a routerLink="/">Inicio</a></li>
            @if (authService.currentUser()) {
              @if (isProgrammer()) {
                <li><a routerLink="/dashboard/received-requests">Solicitudes recibidas</a></li>
              } @else {
                <li><a routerLink="/dashboard/my-requests">Mis solicitudes</a></li>
              }
              <li><a (click)="logout()">Cerrar sesión</a></li>
            } @else {
              <li><a routerLink="/auth/login">Iniciar sesión</a></li>
              <li><a routerLink="/auth/register">Registrarse</a></li>
            }
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class NavbarComponent {
  authService = inject(FirebaseAuthService);
  private router = inject(Router);

  isProgrammer(): boolean {
    const email = this.authService.currentUser()?.email ?? '';
    return environment.programmerEmails.includes(email);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }
}