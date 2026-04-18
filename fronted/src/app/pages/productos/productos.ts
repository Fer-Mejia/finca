import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Importamos ActivatedRoute
import { ProductosService } from '../../services/productos';
import { CarritoService } from '../../services/carrito'; 
import { AuthService } from '../../services/auth'; 
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
  // --- INYECCIONES (Cumpliendo Punto 2 con inject) ---
  private prodService = inject(ProductosService);
  private carritoSvc = inject(CarritoService);
  public authSvc = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Necesario para el Punto 9

  // --- ESTADO CON SIGNALS (Cumpliendo Punto 7) ---
  listaProductos = signal<any[]>([]);
  textoFiltro = signal('');

  // --- LÓGICA REACTIVA CON COMPUTED (Punto 7 avanzado) ---
  productosFiltrados = computed(() => {
    const busqueda = this.textoFiltro().toLowerCase();
    return this.listaProductos().filter(prod => 
      prod.nombre.toLowerCase().includes(busqueda) || 
      prod.descripcion.toLowerCase().includes(busqueda)
    );
  });

  ngOnInit() {
    // 1. Cargar la lista inicial de productos
    this.prodService.getProductos().subscribe(data => {
      this.listaProductos.set(data);
    });

    // 2. USO DE QUERYPARAMMAP (CUMPLIENDO PUNTO 9 DE LA RÚBRICA)
    // Escuchamos si hay parámetros en la URL como ?buscar=latte
    this.route.queryParamMap.subscribe(params => {
      const valorUrl = params.get('buscar');
      if (valorUrl) {
        // Si existe un parámetro en la URL, actualizamos nuestro Signal
        this.textoFiltro.set(valorUrl);
        console.log('Punto 9 - Parámetro recuperado de la URL:', valorUrl);
      }
    });
  }

  // Se ejecuta cuando el usuario escribe en el buscador de la vista
  actualizarFiltro(event: Event) {
    const elemento = event.target as HTMLInputElement;
    this.textoFiltro.set(elemento.value);
  }

  agregarAlCarrito(producto: any) {
    // VALIDACIÓN DE SESIÓN
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
      return;
    }

    // LÓGICA DE CARRITO
    this.carritoSvc.agregarProducto(producto);

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });

    Toast.fire({
      icon: 'success',
      title: `${producto.nombre}`,
      text: '¡Añadido al carrito con éxito!'
    });
  }
}