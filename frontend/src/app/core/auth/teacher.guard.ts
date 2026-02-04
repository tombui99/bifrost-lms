import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from './auth.service';

export const teacherGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const userRole = authService.getUserRole();
  if (userRole === 'Teacher' || userRole === 'Admin') {
    return true;
  }

  // Redirect to dashboard if not authorized
  return router.createUrlTree(['/dashboard']);
};
