import { Component, input } from '@angular/core';
import { Project } from '../../core/models/project.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-project-card',
  standalone: true,
  template: `
    <div class="card bg-base-100 shadow-md hover:shadow-xl transition-shadow">
      <figure>
        <img
          [src]="imageUrl()"
          [alt]="project().name"
          class="w-full h-44 object-cover"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title text-base">{{ project().name }}</h2>
        <p class="text-sm text-base-content/70">{{ project().shortDescription }}</p>
        <div class="flex flex-wrap gap-1 mt-1">
          @for (tech of techs(); track tech) {
            <span class="badge badge-outline badge-sm">{{ tech }}</span>
          }
        </div>
        <div class="card-actions justify-end mt-3">
          @if (project().repoUrl) {
            <a [href]="project().repoUrl" target="_blank" class="btn btn-outline btn-xs">Repositorio</a>
          }
          @if (project().demoUrl) {
            <a [href]="project().demoUrl" target="_blank" class="btn btn-primary btn-xs">Demo</a>
          }
        </div>
      </div>
    </div>
  `,
})
export class ProjectCardComponent {
  project = input.required<Project>();

  imageUrl(): string {
    const url = this.project().image?.url ?? '';
    return url.startsWith('http') ? url : `${environment.strapiUrl.replace('/api', '')}${url}`;
  }

  techs(): string[] {
    return (this.project().technologies ?? '')
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);
  }
}