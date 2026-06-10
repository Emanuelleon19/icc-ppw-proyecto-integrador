import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Programmer } from '../models/programmer.model';
import { Project } from '../models/project.model';
import { Service } from '../models/service.model';

@Injectable({ providedIn: 'root' })
export class StrapiService {
  private http = inject(HttpClient);
  private base = environment.strapiUrl;

  getProgrammers() {
    return this.http
      .get<any>(`${this.base}/programmers?populate=*`)
      .pipe(map((res) => res.data as Programmer[]));
  }

  getProgrammerBySlug(slug: string) {
    return this.http
      .get<any>(`${this.base}/programmers?filters[slug][$eq]=${slug}&populate=*`)
      .pipe(map((res) => res.data[0] as Programmer));
  }

  getFeaturedProjects() {
    return this.http
      .get<any>(`${this.base}/projects?filters[featured][$eq]=true&populate=*`)
      .pipe(map((res) => res.data as Project[]));
  }

  getProjectsByProgrammer(slug: string) {
    return this.http
      .get<any>(
        `${this.base}/projects?filters[programmers][slug][$eq]=${slug}&populate=*`
      )
      .pipe(map((res) => res.data as Project[]));
  }

getServices() {
  return this.http
    .get<any>(`${this.base}/services?populate=*`)
    .pipe(map((res) => res.data as Service[]));
}
}