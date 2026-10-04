import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  const expectedRoles = (route.data?.['roles'] as string[]) || [];
  const userRole = authService.getUserRole();

  // If no specific roles required, allow access
  if (expectedRoles.length === 0) {
    return true;
  }

  // Normalize role comparison (e.g., 'ADMIN' matches 'ROLE_ADMIN')
  const normalize = (r: string) => r.replace(/^ROLE_/, '').toUpperCase();
  const normalizedUserRole = userRole ? normalize(userRole) : '';

  const hasMatchingRole = expectedRoles.some((r) => normalize(r) === normalizedUserRole);

  if (hasMatchingRole) {
    return true;
  }

  // Role not permitted: redirect to dashboard
  return router.createUrlTree(['/dashboard']);
};
