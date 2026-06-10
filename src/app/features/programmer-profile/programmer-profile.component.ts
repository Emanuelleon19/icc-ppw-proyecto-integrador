import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StrapiService } from '../../core/services/strapi.service';
import { ProjectCardComponent } from '../../shared/components/project-card.component';
import { Programmer } from '../../core/models/programmer.model';
import { Project } from '../../core/models/project.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-programmer-profile',
  standalone: true,
  imports: [RouterLink, ProjectCardComponent],
  template: `
    @if (loading()) {
      <div class="flex justify-center items-center min-h-screen">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
    } @else if (!programmer()) {
      <div class="flex justify-center items-center min-h-screen">
        <div class="text-center">
          <p class="text-2xl font-bold mb-4">Programador no encontrado</p>
          <a routerLink="/" class="btn btn-primary">Volver al inicio</a>
        </div>
      </div>
    } @else {
      <!-- HEADER DEL PERFIL -->
      <section class="bg-base-100 py-16 px-4">
        <div class="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <img
            [src]="photoUrl()"
            [alt]="programmer()!.name"
            class="rounded-full w-36 h-36 object-cover ring-4 ring-primary shadow-lg"
          />
          <div class="text-center md:text-left">
            <h1 class="text-4xl font-bold">{{ programmer()!.name }}</h1>
            <p class="badge badge-primary badge-outline mt-2 text-sm">
              {{ programmer()!.specialty }}
            </p>
            <p class="mt-4 text-base-content/70 max-w-xl">
              {{ programmer()!.shortDescription }}
            </p>
            <div class="flex gap-3 mt-4 justify-center md:justify-start">
              @if (programmer()!.github) {
                <a [href]="programmer()!.github" target="_blank" class="btn btn-outline btn-sm">
                  GitHub
                </a>
              }
              @if (programmer()!.linkedin) {
                <a [href]="programmer()!.linkedin" target="_blank" class="btn btn-outline btn-sm">
                  LinkedIn
                </a>
              }
              <a routerLink="/contact" class="btn btn-primary btn-sm">
                Contactar
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- DESCRIPCION COMPLETA -->
      @if (programmer()!.fullDescription) {
        <section class="py-12 px-4 bg-base-200">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold mb-4">Sobre mí</h2>
            <p class="text-base-content/80 leading-relaxed">
              {{ programmer()!.fullDescription }}
            </p>
          </div>
        </section>
      }

      <!-- PROYECTOS -->
      <section class="py-16 px-4">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold mb-8">Proyectos</h2>

          @if (loadingProjects()) {
            <div class="flex justify-center">
              <span class="loading loading-spinner loading-lg text-primary"></span>
            </div>
          } @else if (projects().length === 0) {
            <p class="text-base-content/50">No hay proyectos registrados aún.</p>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (p of projects(); track p.id) {
                <app-project-card [project]="p" />
              }
            </div>
          }
        </div>
      </section>
    }
  `,
})
export class ProgrammerProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private strapi = inject(StrapiService);

  programmer = signal<Programmer | null>(null);
  projects = signal<Project[]>([]);
  loading = signal(true);
  loadingProjects = signal(true);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';

    this.strapi.getProgrammerBySlug(slug).subscribe({
      next: (data) => {
        this.programmer.set(data);
        this.loading.set(false);
        this.loadProjects(slug);
      },
      error: () => this.loading.set(false),
    });
  }

  private loadProjects(slug: string) {
    this.strapi.getProjectsByProgrammer(slug).subscribe({
      next: (data) => {
        this.projects.set(data);
        this.loadingProjects.set(false);
      },
      error: () => this.loadingProjects.set(false),
    });
  }

  photoUrl(): string {
    const url = this.programmer()?.photo?.url ?? '';
    return url.startsWith('http')
      ? url
      : `${environment.strapiUrl.replace('/api', '')}${url}`;
  }
} 