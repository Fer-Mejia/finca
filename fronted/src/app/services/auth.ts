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

  private urlLogin = 'https://finca-sho6.onrender.com/api/usuarios/login';
  private urlRegistro = 'https://finca-sho6.onrender.com/api/usuarios';

  public usuarioActual = signal<any>(JSON.parse(localStorage.getItem('usuario') || 'null'));

  login(correo: string, password: string) {
    return this.http.post(this.urlLogin, { correo, password }).pipe(
      tap((res: any) => {
        if (res && res.usuario) {
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

  logout() {
    localStorage.removeItem('usuario');
    this.usuarioActual.set(null); 
    this.router.navigate(['/login']);
  }

  esAdmin(): boolean {
    const usuario = this.usuarioActual();
    return usuario && usuario.rol === 'admin';
  }
}