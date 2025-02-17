import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiresAuth = route.data['requiresAuth'] ?? true;
  const requiredRole = route.data['role'];
  const isAuthenticated = !!authService.getCurrentUser();

  if (requiresAuth && !isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRole && !authService.hasRole(requiredRole)) {
    router.navigate(['/game']);
    return false;
  }

  if (!requiresAuth && isAuthenticated) {
    router.navigate(['/game']);
    return false;
  }

  return true;
};
