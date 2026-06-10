import { Programmer } from './programmer.model';

export type ProjectType = 'academico' | 'personal' | 'laboral' | 'simulado';

/** Estructura de datos para la gestión y tipado de proyectos en el portafolio */
export interface Project {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  image: { url: string };
  type: ProjectType;
  technologies: string;
  repoUrl: string;
  demoUrl: string;
  featured: boolean;
  programmers: Programmer[];
}