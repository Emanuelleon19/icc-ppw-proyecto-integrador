import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div class="card w-full max-w-md bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-2xl justify-center mb-4">Crear cuenta</h2>

          @if (error()) {
            <div class="alert alert-error text-sm">{{ error() }}</div>
          }

          @if (success()) {
            <div class="alert alert-success text-sm">
              Cuenta creada. Redirigiendo...
            </div>
          }

          <div class="form-control gap-1">
            <label class="label"><span class="label-text">Correo</span></label>
            <input
              type="email"
              class="input input-bordered"
              placeholder="correo@ejemplo.com"
              [(ngModel)]="email"
            />
          </div>

          <div class="form-control gap-1 mt-2">
            <label class="label"><span class="label-text">Contraseña</span></label>
            <input
              type="password"
              class="input input-bordered"
              placeholder="Mínimo 6 caracteres"
              [(ngModel)]="password"
            />
          </div>

          <div class="form-control gap-1 mt-2">
            <label class="label"><span class="label-text">Confirmar contraseña</span></label>
            <input
              type="password"
              class="input input-bordered"
              placeholder="Repite la contraseña"
              [(ngModel)]="confirm"
            />
          </div>

          <div class="card-actions mt-6">
            <button
              class="btn btn-primary w-full"
              [disabled]="loading()"
              (click)="register()"
            >
              @if (loading()) {
                <span class="loading loading-spinner loading-sm"></span>
              } @else {
                Registrarse
              }
            </button>
          </div>

          <p class="text-center text-sm mt-3 text-base-content/70">
            ¿Ya tienes cuenta?
            <a routerLink="/auth/login" class="link link-primary">Inicia sesión</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private authService = inject(FirebaseAuthService);
  private router = inject(Router);

  email = '';
  password = '';
  confirm = '';
  loading = signal(false);
  error = signal('');
  success = signal(false);

  async register() {
    if (!this.email || !this.password || !this.confirm) {
      this.error.set('Completa todos los campos.');
      return;
    }

    if (this.password !== this.confirm) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }

    if (this.password.length < 6) {
      this.error.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      await this.authService.register(this.email, this.password);
      this.success.set(true);
      setTimeout(() => this.router.navigate(['/']), 1500);
    } catch (e: any) {
      this.error.set(this.parseError(e.code));
    } finally {
      this.loading.set(false);
    }
  }

  private parseError(code: string): string {
    const errors: Record<string, string> = {
      'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
      'auth/invalid-email': 'El correo no es válido.',
      'auth/weak-password': 'La contraseña es muy débil.',
    };
    return errors[code] ?? 'Error al registrarse.';
  }
}