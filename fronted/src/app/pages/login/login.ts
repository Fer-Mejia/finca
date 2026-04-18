import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth'; 
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html'
})
export class Login {
  private authSvc = inject(AuthService);
  private router = inject(Router);

  credenciales = { correo: '', password: '' };

  onLogin() {
    this.authSvc.login(this.credenciales.correo, this.credenciales.password).subscribe({
      next: (res: any) => {
        this.router.navigate(['/productos']); 
      },
      error: (err: any) => {
        console.error('Detalle del error:', err);
      }
    });
  }
}