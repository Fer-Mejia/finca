import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth'; 

export const adminGuard = () => {
  const authSvc = inject(AuthService);
  const router = inject(Router);

  // Verificamos si es administrador
  if (authSvc.esAdmin()) {
    return true;
  }

  // Si no es admin, lo mandamos a inicio
  router.navigate(['/']);
  return false;
};