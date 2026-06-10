import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseAuthService } from '../services/firebase-auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(FirebaseAuthService);
  const router = inject(Router);

  if (auth.currentUser()) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};