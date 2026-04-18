import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth'; 
import Swal from 'sweetalert2'; // <-- 1. Importación necesaria

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html'
})
export class Registro {
  
  private authSvc = inject(AuthService); 
  private router = inject(Router);

  nuevoUsuario = {
    nombre: '',
    correo: '',
    password: ''
  };

  onRegistro() {
    console.log('Datos que voy a enviar:', this.nuevoUsuario);

    this.authSvc.registrar(this.nuevoUsuario).subscribe({
      next: (res: any) => {
        // 2. Alerta de éxito elegante
        Swal.fire({
          icon: 'success',
          title: '¡Cuenta creada!',
          text: `Bienvenido a La Finca, ${this.nuevoUsuario.nombre}. Ya puedes iniciar sesión.`,
          confirmButtonColor: '#3e2723' // Tu color café
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        console.error('ERROR DETALLADO:', err);
        // 3. Alerta de error elegante
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: 'Hubo un problema al crear tu cuenta. Por favor, intenta de nuevo.',
          confirmButtonColor: '#3e2723'
        });
      }
    });
  }
}