import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AuthService } from './services/auth'; 
import Swal from 'sweetalert2'; // <-- ¡No olvides importar Swal!

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    CommonModule 
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { 
  title = 'La Finca - Cafetería';
  
  public authSvc = inject(AuthService); 
  private router = inject(Router);

  // --- LOGOUT CON CONFIRMACIÓN ---
  logout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: "¡Te extrañaremos! Vuelve pronto por un café.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3e2723', // Color café
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authSvc.logout();
        // Nota: Si tu authSvc.logout ya tiene el router.navigate, no hace falta ponerlo aquí.
        
        Swal.fire({
          title: '¡Sesión cerrada!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

  // --- SUSCRIPCIÓN AL NEWSLETTER ---
  suscribir(correo: string) {
    const email = correo.trim();
    if (email.includes('@') && email.includes('.')) {
      Swal.fire({
        icon: 'success',
        title: '¡Suscripción exitosa!',
        text: `Te hemos enviado un cupón de bienvenida a: ${email}`,
        confirmButtonColor: '#3e2723'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Por favor, ingresa un correo electrónico real para enviarte tu cupón.',
        confirmButtonColor: '#3e2723'
      });
    }
  }
}