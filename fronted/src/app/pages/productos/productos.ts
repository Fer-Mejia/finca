import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ProductosService } from '../../services/productos';
import { CarritoService } from '../../services/carrito'; 
import { AuthService } from '../../services/auth'; // <-- Importamos el servicio de Auth
import { Router } from '@angular/router'; // <-- Importamos el Router
import { CommonModule, CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, CurrencyPipe], 
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class Productos implements OnInit {
  private prodService = inject(ProductosService);
  private carritoSvc = inject(CarritoService);
  public authSvc = inject(AuthService); // <-- Inyectamos Auth
  private router = inject(Router);      // <-- Inyectamos Router

  listaProductos = signal<any[]>([]);
  textoFiltro = signal('');

  productosFiltrados = computed(() => {
    const busqueda = this.textoFiltro().toLowerCase();
    return this.listaProductos().filter(prod => 
      prod.nombre.toLowerCase().includes(busqueda) || 
      prod.descripcion.toLowerCase().includes(busqueda)
    );
  });

  ngOnInit() {
    this.prodService.getProductos().subscribe(data => {
      this.listaProductos.set(data);
    });
  }

  actualizarFiltro(event: Event) {
    const elemento = event.target as HTMLInputElement;
    this.textoFiltro.set(elemento.value);
  }

  agregarAlCarrito(producto: any) {
    // --- PASO 1: VALIDACIÓN DE SESIÓN ---
    if (!this.authSvc.usuarioActual()) {
      Swal.fire({
        title: '¡Atención!',
        text: 'Debes iniciar sesión para agregar productos al carrito ☕',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3e2723',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ir al Login',
        cancelButtonText: 'Seguir mirando'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return; // Detenemos la ejecución aquí
    }

    // --- PASO 2: LÓGICA NORMAL (Si está logueado) ---
    this.carritoSvc.agregarProducto(producto);

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });

    Toast.fire({
      icon: 'success',
      title: `${producto.nombre}`,
      text: '¡Añadido al carrito con éxito!'
    });
  }

  
}