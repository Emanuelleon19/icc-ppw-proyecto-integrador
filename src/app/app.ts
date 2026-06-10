import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar.component';
import { FooterComponent } from './shared/components/footer.component';

/**
 * Componente raíz de la aplicación.
 * Contiene la estructura principal del sitio y
 * carga dinámicamente las vistas según la ruta activa.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <!-- Barra de navegación global -->
    <app-navbar />

    <!-- Área principal donde se renderizan las páginas de la aplicación -->
    <main class="min-h-screen bg-base-200">
      <router-outlet />
    </main>

    <!-- Pie de página global -->
    <app-footer />
  `,
})
export class App {}