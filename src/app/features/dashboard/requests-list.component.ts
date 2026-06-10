import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { ContactRequest } from '../../core/models/request.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-requests-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-base-200 py-12 px-4">
      <div class="max-w-4xl mx-auto">

        <!-- HEADER -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold">
            {{ isProgrammer() ? 'Solicitudes recibidas' : 'Mis solicitudes' }}
          </h1>
          <p class="text-base-content/60 mt-1">
            {{ isProgrammer()
              ? 'Gestiona las solicitudes de contacto que te han enviado'
              : 'Revisa el estado de tus solicitudes enviadas'
            }}
          </p>
        </div>

        @if (loading()) {
          <div class="flex justify-center py-20">
            <span class="loading loading-spinner loading-lg text-primary"></span>
          </div>
        } @else if (requests().length === 0) {
          <div class="card bg-base-100 shadow p-10 text-center">
            <p class="text-base-content/50 text-lg">No hay solicitudes aún.</p>
          </div>
        } @else {
          <div class="flex flex-col gap-4">
            @for (req of requests(); track req.id) {
              <div class="card bg-base-100 shadow-md">
                <div class="card-body">

                  <!-- CABECERA -->
                  <div class="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <h2 class="card-title text-base">{{ req.applicantName }}</h2>
                      <p class="text-sm text-base-content/60">{{ req.userEmail }}</p>
                    </div>
                    <span
                      class="badge"
                      [class]="req.status === 'Pendiente' ? 'badge-warning' : 'badge-success'"
                    >
                      {{ req.status }}
                    </span>
                  </div>

                  <!-- IDEA -->
                  <div class="mt-2">
                    <p class="text-sm font-medium text-base-content/70">Idea del proyecto:</p>
                    <p class="text-sm mt-1">{{ req.projectIdea }}</p>
                  </div>

                  <!-- FECHA -->
                  <p class="text-xs text-base-content/40 mt-1">
                    {{ formatDate(req.createdAt) }}
                  </p>

                  <!-- RESPUESTA EXISTENTE -->
                  @if (req.response) {
                    <div class="mt-3 p-3 bg-base-200 rounded-lg">
                      <p class="text-xs font-medium text-base-content/60 mb-1">
                        Respuesta del programador:
                      </p>
                      <p class="text-sm">{{ req.response }}</p>
                    </div>
                  }

                  <!-- PANEL PROGRAMADOR -->
                  @if (isProgrammer()) {
                    <div class="divider my-2"></div>
                    <div class="flex flex-col gap-2">
                      <textarea
                        class="textarea textarea-bordered text-sm"
                        placeholder="Escribe una respuesta u observación..."
                        [(ngModel)]="responses[req.id!]"
                        rows="2"
                      ></textarea>
                      <div class="flex gap-2 justify-end">
                        <button
                          class="btn btn-sm btn-success"
                          [disabled]="saving[req.id!]"
                          (click)="respond(req)"
                        >
                          @if (saving[req.id!]) {
                            <span class="loading loading-spinner loading-xs"></span>
                          } @else {
                            Guardar respuesta
                          }
                        </button>
                      </div>
                    </div>
                  }

                </div>
              </div>
            }
          </div>
        }

      </div>
    </div>
  `,
})
export class RequestsListComponent implements OnInit {
  private auth = inject(FirebaseAuthService);
  private firestoreService = inject(FirestoreService);
  private router = inject(Router);

  requests = signal<ContactRequest[]>([]);
  loading = signal(true);
  responses: Record<string, string> = {};
  saving: Record<string, boolean> = {};

  isProgrammer = computed(() => {
    const email = this.auth.currentUser()?.email ?? '';
    return environment.programmerEmails.includes(email);
  });

  ngOnInit() {
    const user = this.auth.currentUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.loadRequests(user);
  }

  private async loadRequests(user: any) {
    try {
      const snap = this.isProgrammer()
        ? await this.firestoreService.getRequestsByProgrammer(
            this.getProgrammerSlug(user.email)
          )
        : await this.firestoreService.getRequestsByUser(user.uid);

      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data()['createdAt']?.toDate?.() ?? new Date(),
      })) as ContactRequest[];

      // Pre-cargar respuestas existentes en el textarea
      data.forEach((r) => {
        if (r.response) this.responses[r.id!] = r.response;
      });

      this.requests.set(data);
    } catch (e) {
      console.error(e);
    } finally {
      this.loading.set(false);
    }
  }

  async respond(req: ContactRequest) {
    const response = this.responses[req.id!] ?? '';
    this.saving[req.id!] = true;

    try {
      await this.firestoreService.updateRequest(req.id!, {
        status: 'Respondida',
        response,
      });

      // Actualizar localmente sin recargar
      this.requests.update((list) =>
        list.map((r) =>
          r.id === req.id ? { ...r, status: 'Respondida', response } : r
        )
      );
    } catch (e) {
      console.error(e);
    } finally {
      this.saving[req.id!] = false;
    }
  }

  private getProgrammerSlug(email: string): string {
    const index = environment.programmerEmails.indexOf(email);
    return environment.programmerSlugs?.[index] ?? '';
  }

  formatDate(date: any): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}