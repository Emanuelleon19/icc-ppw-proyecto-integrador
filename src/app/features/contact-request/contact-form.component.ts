import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { StrapiService } from '../../core/services/strapi.service';
import { Programmer } from '../../core/models/programmer.model';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-base-200 py-12 px-4">
      <div class="max-w-xl mx-auto">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-2xl justify-center mb-2">
              Enviar solicitud de contacto
            </h2>
            <p class="text-center text-base-content/60 text-sm mb-4">
              Cuéntanos tu idea y te contactaremos pronto
            </p>

            @if (error()) {
              <div class="alert alert-error text-sm">{{ error() }}</div>
            }

            @if (success()) {
              <div class="alert alert-success text-sm">
                ¡Solicitud enviada correctamente!
              </div>
            }

            <!-- Nombre -->
            <div class="form-control gap-1">
              <label class="label"><span class="label-text">Tu nombre</span></label>
              <input
                type="text"
                class="input input-bordered"
                placeholder="Juan Pérez"
                [(ngModel)]="form.applicantName"
              />
            </div>

            <!-- Correo -->
            <div class="form-control gap-1 mt-2">
              <label class="label"><span class="label-text">Tu correo</span></label>
              <input
                type="email"
                class="input input-bordered"
                placeholder="correo@ejemplo.com"
                [(ngModel)]="form.userEmail"
              />
            </div>

            <!-- Idea del proyecto -->
            <div class="form-control gap-1 mt-2">
              <label class="label"><span class="label-text">Describe tu idea</span></label>
              <textarea
                class="textarea textarea-bordered h-28"
                placeholder="Quiero desarrollar una aplicación que..."
                [(ngModel)]="form.projectIdea"
              ></textarea>
            </div>

            <!-- Programador -->
            <div class="form-control gap-1 mt-2">
              <label class="label"><span class="label-text">Dirigir a</span></label>
              @if (loadingProgrammers()) {
                <span class="loading loading-spinner loading-sm text-primary"></span>
              } @else {
                <select class="select select-bordered" [(ngModel)]="form.programmerSlug">
                  <option value="">Selecciona un programador</option>
                  @for (p of programmers(); track p.id) {
                    <option [value]="p.slug">{{ p.name }} — {{ p.specialty }}</option>
                  }
                </select>
              }
            </div>

            <div class="card-actions mt-6">
              <button
                class="btn btn-primary w-full"
                [disabled]="loading() || success()"
                (click)="submit()"
              >
                @if (loading()) {
                  <span class="loading loading-spinner loading-sm"></span>
                } @else {
                  Enviar solicitud
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ContactFormComponent implements OnInit {
  private auth = inject(FirebaseAuthService);
  private firestoreService = inject(FirestoreService);
  private strapi = inject(StrapiService);
  private router = inject(Router);

  programmers = signal<Programmer[]>([]);
  loadingProgrammers = signal(true);
  loading = signal(false);
  error = signal('');
  success = signal(false);

  form = {
    applicantName: '',
    userEmail: '',
    projectIdea: '',
    programmerSlug: '',
  };

  ngOnInit() {
    this.strapi.getProgrammers().subscribe({
      next: (data) => {
        this.programmers.set(data);
        this.loadingProgrammers.set(false);
      },
      error: () => this.loadingProgrammers.set(false),
    });
  }

  async submit() {
    const { applicantName, userEmail, projectIdea, programmerSlug } = this.form;

    if (!applicantName || !userEmail || !projectIdea || !programmerSlug) {
      this.error.set('Completa todos los campos.');
      return;
    }

    const user = this.auth.currentUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      await this.firestoreService.createRequest({
        uid: user.uid,
        userEmail,
        applicantName,
        projectIdea,
        programmerSlug,
        createdAt: new Date(),
        status: 'Pendiente',
      });
      this.success.set(true);
      setTimeout(() => this.router.navigate(['/dashboard/my-requests']), 2000);
    } catch (e) {
      this.error.set('Error al enviar la solicitud. Intenta de nuevo.');
    } finally {
      this.loading.set(false);
    }
  }
}