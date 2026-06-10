import { Component, input } from '@angular/core';
import { Project } from '../../core/models/project.model';
import { environment } from '../../environments/environment';

/**
 * @component ProjectCardComponent
 * @description
 * Componente que renderiza una tarjeta (Card) visual para un proyecto individual.
 * Utiliza clases de Tailwind CSS y DaisyUI para el diseño responsivo.
 * * Presenta la imagen del proyecto, título, descripción corta, etiquetas de tecnologías
 * y enlaces condicionales al repositorio de código y al despliegue en vivo (demo).
 */
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
  /**
   * Señal (Signal) de entrada requerida con los datos del proyecto a mostrar.
   * @type {InputSignal<Project>}
   */
  project = input.required<Project>();

  /**
   * Resuelve y formatea la URL de la imagen del proyecto.
   * * @description
   * Verifica si la imagen provista es una URL absoluta (externa) o relativa (local del CMS).
   * Si es relativa, concatena la URL base de Strapi (limpiando el sufijo `/api`).
   * * @returns {string} URL completa de la imagen o un string vacío si no existe.
   */
  imageUrl(): string {
    const url = this.project().image?.url ?? '';
    return url.startsWith('http') ? url : `${environment.strapiUrl.replace('/api', '')}${url}`;
  }

  /**
   * Transforma la cadena de tecnologías en un array de strings listos para iterar.
   * * @description
   * Toma el string de tecnologías del proyecto (ej: "Angular, Tailwind, Strapi"),
   * lo separa por comas, elimina los espacios en blanco innecesarios y filtra
   * cualquier elemento vacío para evitar renderizados erróneos.
   * * @returns {string[]} Listado de tecnologías formateadas como elementos individuales.
   */
  techs(): string[] {
    return (this.project().technologies ?? '')
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);
  }
}