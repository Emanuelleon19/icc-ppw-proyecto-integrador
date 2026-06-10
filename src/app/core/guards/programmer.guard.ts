import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { environment } from '../../environments/environment';

export const programmerGuard: CanActivateFn = () => {
  const auth = inject(FirebaseAuthService);
  const router = inject(Router);
  const user = auth.currentUser();

  if (!user) {
    router.navigate(['/auth/login']);
    return false;
  }

  const isProgrammer = environment.programmerEmails.includes(user.email ?? '');

  if (isProgrammer) {
    return true;
  }

  router.navigate(['/dashboard/my-requests']);
  return false;
};