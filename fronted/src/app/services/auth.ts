import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import Swal from 'sweetalert2'; // <-- Importamos SweetAlert

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private urlLogin = 'http://localhost:3000/api/usuarios/login';
  private urlRegistro = 'http://localhost:3000/api/usuarios';

  usuarioActual = signal<any>(JSON.parse(localStorage.getItem('usuario') || 'null'));

  login(correo: string, password: string) {
    return this.http.post(this.urlLogin, { correo, password }).pipe(
      tap((res: any) => {
        if (res && res.usuario) {
          localStorage.setItem('usuario', JSON.stringify(res.usuario));
          this.usuarioActual.set(res.usuario);

          // Alerta de éxito
          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: `Hola de nuevo, ${res.usuario.nombre || 'café-adicto'}`,
            timer: 2000,
            showConfirmButton: false
          });
        }
      }),
      catchError((err) => {
        // Alerta de error si los datos son incorrectos
        Swal.fire({
          icon: 'error',
          title: 'Error de acceso',
          text: 'Correo o contraseña incorrectos. Inténtalo de nuevo.',
          confirmButtonColor: '#3e2723'
        });
        return of(err);
      })
    );
  }

  registrar(datos: any) {
    return this.http.post(this.urlRegistro, datos).pipe(
      tap(() => {
        Swal.fire({
          icon: 'success',
          title: '¡Cuenta creada!',
          text: 'Ya puedes iniciar sesión en La Finca.',
          confirmButtonColor: '#3e2723'
        });
      }),
      catchError((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: 'No pudimos crear tu cuenta. Verifica tus datos.',
          confirmButtonColor: '#3e2723'
        });
        return of(err);
      })
    );
  }

  logout() {
    // Alerta de confirmación antes de salir
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: "¡Te extrañaremos por aquí!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3e2723',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('usuario');
        this.usuarioActual.set(null);
        this.router.navigate(['/login']);
        
        Swal.fire({
          title: '¡Sesión cerrada!',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      }
    });
  }
}