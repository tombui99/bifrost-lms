import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthenticationService } from './auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const role = authService.getUserRole();
  if (authService.isAuthenticated() && (role === 'Admin' || role === 'TenantAdmin')) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
