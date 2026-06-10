import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Programmer } from '../../core/models/programmer.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-programmer-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="card bg-base-100 shadow-md hover:shadow-xl transition-shadow">
      <figure class="px-6 pt-6">
        <img
          [src]="photoUrl()"
          [alt]="programmer().name"
          class="rounded-full w-28 h-28 object-cover ring-4 ring-primary"
        />
      </figure>
      <div class="card-body items-center text-center">
        <h2 class="card-title text-lg">{{ programmer().name }}</h2>
        <p class="badge badge-primary badge-outline text-xs">
          {{ programmer().specialty }}
        </p>
        <p class="text-sm text-base-content/70 mt-1">
          {{ programmer().shortDescription }}
        </p>
        <div class="card-actions mt-3">
          <a [routerLink]="['/programmer', programmer().slug]" class="btn btn-primary btn-sm">Ver perfil</a>
        </div>
      </div>
    </div>
  `,
})
export class ProgrammerCardComponent {
  programmer = input.required<Programmer>();

  photoUrl(): string {
    const url = this.programmer().photo?.url ?? '';
    return url.startsWith('http') ? url : `${environment.strapiUrl.replace('/api', '')}${url}`;
  }
}