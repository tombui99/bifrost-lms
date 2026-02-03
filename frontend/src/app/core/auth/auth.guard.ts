import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

export const roleGuard: (requiredRole: string) => CanActivateFn = (requiredRole) => {
  return (route, state) => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) return router.createUrlTree(['/login']);

    const userRole = authService.getUserRole();
    if (userRole === requiredRole || userRole === 'Admin') {
      return true;
    }

    return false; // Or redirect to unauthorized page
  };
};
