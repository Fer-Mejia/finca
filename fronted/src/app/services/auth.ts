import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private urlLogin = 'http://localhost:3000/api/usuarios/login';
  private urlRegistro = 'http://localhost:3000/api/usuarios';

  // El Signal se inicializa con lo que haya en el Storage (mantiene la sesión al recargar)
  public usuarioActual = signal<any>(JSON.parse(localStorage.getItem('usuario') || 'null'));

  /**
   * Intenta iniciar sesión en el servidor.
   * Si es exitoso, guarda el usuario (incluyendo el rol) en LocalStorage y el Signal.
   */
  login(correo: string, password: string) {
    return this.http.post(this.urlLogin, { correo, password }).pipe(
      tap((res: any) => {
        if (res && res.usuario) {
          // Guardamos el objeto completo (id, nombre, correo, rol)
          localStorage.setItem('usuario', JSON.stringify(res.usuario));
          this.usuarioActual.set(res.usuario); 

          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: `Hola de nuevo, ${res.usuario.nombre}`,
            timer: 2000,
            showConfirmButton: false
          });
        }
      }),
      catchError((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error de acceso',
          text: 'Correo o contraseña incorrectos.',
          confirmButtonColor: '#3e2723'
        });
        return of(err);
      })
    );
  }

  /**
   * Registra un nuevo cliente en la base de datos.
   */
  registrar(datos: any) {
    return this.http.post(this.urlRegistro, datos).pipe(
      tap(() => {
        Swal.fire({
          icon: 'success',
          title: '¡Cuenta creada!',
          text: 'Ya puedes iniciar sesión.',
          confirmButtonColor: '#3e2723'
        });
      }),
      catchError((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: 'No pudimos crear tu cuenta.',
          confirmButtonColor: '#3e2723'
        });
        return of(err);
      })
    );
  }

  /**
   * Cierra la sesión, limpia el almacenamiento y redirige al login.
   */
  logout() {
    localStorage.removeItem('usuario');
    this.usuarioActual.set(null); 
    this.router.navigate(['/login']);
  }

  /**
   * Función de utilidad para verificar si el usuario logueado es administrador.
   * Se usa en Guards y en el Navbar para mostrar/ocultar opciones.
   */
  esAdmin(): boolean {
    const usuario = this.usuarioActual();
    return usuario && usuario.rol === 'admin';
  }
}