import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseAuthService } from '../services/firebase-auth.service';

export const publicGuard: CanActivateFn = () => {
  const auth = inject(FirebaseAuthService);
  const router = inject(Router);

  if (auth.currentUser()) {
    router.navigate(['/']);
    return false;
  }

  return true;
};