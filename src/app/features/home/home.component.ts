import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StrapiService } from '../../core/services/strapi.service';
import { ProgrammerCardComponent } from '../../shared/components/programmer-card.component';
import { ProjectCardComponent } from '../../shared/components/project-card.component';
import { Programmer } from '../../core/models/programmer.model';
import { Project } from '../../core/models/project.model';
import { Service } from '../../core/models/service.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProgrammerCardComponent, ProjectCardComponent],
  template: `
    <!-- HERO -->
    <section class="hero min-h-[60vh] bg-base-100">
      <div class="hero-content text-center flex-col gap-4 py-20">
        <div class="badge badge-primary badge-outline">Portafolio Profesional</div>
        <h1 class="text-5xl font-bold">DevPortfolio</h1>
        <p class="max-w-lg text-base-content/70 text-lg">
          Somos un equipo de desarrolladores web especializados en crear
          soluciones modernas y escalables.
        </p>
        <div class="flex gap-3 mt-2">
          <a routerLink="/contact" class="btn btn-primary">Contáctanos</a>
          <a href="#programadores" class="btn btn-outline">Conoce al equipo</a>
        </div>
      </div>
    </section>

    <!-- PROGRAMADORES -->
    <section id="programadores" class="py-20   px-4 max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-10">Nuestro Equipo</h2>
      @if (loadingProgrammers()) {
        <div class="flex justify-center">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
          @for (p of programmers(); track p.id) {
            <app-programmer-card [programmer]="p" />
          }
        </div>
      }
<!-- SERVICIOS -->
<section class="py-20 px-4 bg-base-100 mt-12">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-3xl font-bold text-center mb-10">Servicios</h2>
    @if (loadingServices()) {
      <div class="flex justify-center">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
    } @else {
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        @for (s of services(); track s.id) {
          <div class="card bg-base-200 shadow-sm">
            <div class="card-body items-center text-center">
              @if (s.image?.url) {
                <img [src]="serviceImageUrl(s)" class="w-16 h-16 object-cover rounded-lg mb-2" />
              } @else {
                <div class="text-4xl mb-2">⚡</div>
              }
              <h3 class="card-title text-base">{{ s.title }}</h3>
              <p class="text-sm text-base-content/70">{{ s.description }}</p>
            </div>
          </div>
        }
      </div>
    }
  </div>
</section>

    <!-- PROYECTOS DESTACADOS -->
    <section class="py-16 px-4 max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-10">Proyectos Destacados</h2>
      @if (loadingProjects()) {
        <div class="flex justify-center">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      } @else if (projects().length === 0) {
        <p class="text-center text-base-content/50">Próximamente proyectos destacados.</p>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (p of projects(); track p.id) {
            <app-project-card [project]="p" />
          }
        </div>
      }
    </section>

    <!-- CONTACTO -->
    <section class="py-16 px-4 bg-base-100">
      <div class="max-w-xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-4">¿Tienes un proyecto en mente?</h2>
        <p class="text-base-content/70 mb-6">
          Envíanos una solicitud y nos ponemos en contacto contigo.
        </p>
        <a routerLink="/contact" class="btn btn-primary btn-lg">Enviar solicitud</a>
      </div>
    </section>
  `,
})

export class HomeComponent implements OnInit {
  private strapi = inject(StrapiService);

  programmers = signal<Programmer[]>([]);
  projects = signal<Project[]>([]);
  services = signal<Service[]>([]);

  loadingProgrammers = signal(true);
  loadingProjects = signal(true);
  loadingServices = signal(true);

  ngOnInit() {
    this.strapi.getProgrammers().subscribe({
      next: (data) => { this.programmers.set(data); this.loadingProgrammers.set(false); },
      error: () => this.loadingProgrammers.set(false),
    });

    this.strapi.getFeaturedProjects().subscribe({
      next: (data) => { this.projects.set(data); this.loadingProjects.set(false); },
      error: () => this.loadingProjects.set(false),
    });

    this.strapi.getServices().subscribe({
      next: (data) => { this.services.set(data); this.loadingServices.set(false); },
      error: () => this.loadingServices.set(false),
    });
  }

  serviceImageUrl(s: Service): string {
    const url = s.image?.url ?? '';
    return url.startsWith('http') ? url : `${environment.strapiUrl.replace('/api', '')}${url}`;
  }
}
