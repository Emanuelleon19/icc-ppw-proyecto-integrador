import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer footer-center bg-base-200 text-base-content p-6 mt-10">
      <p class="text-sm opacity-60">
        © 2026 DevPortfolio — Proyecto Integrador UPS
      </p>
    </footer>
  `,
})
export class FooterComponent {}