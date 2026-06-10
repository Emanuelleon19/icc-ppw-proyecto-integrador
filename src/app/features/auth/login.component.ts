import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';

/**
 * Componente encargado del inicio de sesión de usuarios.
 * Permite autenticar usuarios mediante Firebase Authentication
 * y redirigirlos a la página principal una vez autenticados.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div class="card w-full max-w-md bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-2xl justify-center mb-4">Iniciar sesión</h2>

          <!-- Mensaje de error mostrado cuando ocurre un problema en la autenticación -->
          @if (error()) {
            <div class="alert alert-error text-sm">{{ error() }}</div>
          }

          <!-- Campo para el correo electrónico -->
          <div class="form-control gap-1">
            <label class="label"><span class="label-text">Correo</span></label>
            <input
              type="email"
              class="input input-bordered"
              placeholder="correo@ejemplo.com"
              [(ngModel)]="email"
            />
          </div>

          <!-- Campo para la contraseña -->
          <div class="form-control gap-1 mt-2">
            <label class="label"><span class="label-text">Contraseña</span></label>
            <input
              type="password"
              class="input input-bordered"
              placeholder="••••••••"
              [(ngModel)]="password"
            />
          </div>

          <!-- Botón para ejecutar el proceso de inicio de sesión -->
          <div class="card-actions mt-6">
            <button
              class="btn btn-primary w-full"
              [disabled]="loading()"
              (click)="login()"
            >
              @if (loading()) {
                <span class="loading loading-spinner loading-sm"></span>
              } @else {
                Ingresar
              }
            </button>
          </div>

          <!-- Enlace para redirigir al formulario de registro -->
          <p class="text-center text-sm mt-3 text-base-content/70">
            ¿No tienes cuenta?
            <a routerLink="/auth/register" class="link link-primary">Regístrate</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {

  // Servicios utilizados para autenticación y navegación
  private authService = inject(FirebaseAuthService);
  private router = inject(Router);

  // Variables vinculadas al formulario
  email = '';
  password = '';

  // Estados de carga y manejo de errores
  loading = signal(false);
  error = signal('');

  /**
   * Valida los datos ingresados y realiza el proceso de autenticación.
   * Si el usuario inicia sesión correctamente, es redirigido al inicio.
   */
  async login() {
    if (!this.email || !this.password) {
      this.error.set('Completa todos los campos.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/']);
    } catch (e: any) {
      this.error.set(this.parseError(e.code));
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Traduce los códigos de error de Firebase
   * a mensajes comprensibles para el usuario.
   */
  private parseError(code: string): string {
    const errors: Record<string, string> = {
      'auth/user-not-found': 'No existe una cuenta con ese correo.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/invalid-credential': 'Credenciales inválidas.',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
    };

    return errors[code] ?? 'Error al iniciar sesión.';
  }
}