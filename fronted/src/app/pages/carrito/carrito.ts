import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito';
// 1. ¡ESTA ES LA CLAVE! Importar el RouterModule
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-carrito',
  standalone: true,
  // 2. AGREGARLO AQUÍ en la lista de imports
  imports: [CommonModule, RouterModule], 
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css']
})
export class CarritoComponent {
  public carritoSvc = inject(CarritoService);
}