import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; 
import Swal from 'sweetalert2'; // <-- Importamos SweetAlert

export const authGuard: CanActivateFn = (route, state) => {
  const authSvc = inject(AuthService);
  const router = inject(Router);

  // Debug en consola
  console.log('¿Hay usuario logueado?:', authSvc.usuarioActual());

  if (authSvc.usuarioActual()) {
    return true; 
  }

  // --- SI NO HAY USUARIO ---
  // Reemplazamos el alert feo por un Swal informativo
  Swal.fire({
    icon: 'warning',
    title: 'Acceso restringido',
    text: 'Por favor, inicia sesión para continuar ☕',
    confirmButtonColor: '#3e2723',
    confirmButtonText: 'Ir al Login'
  });

  router.navigate(['/login']);
  return false; 
};