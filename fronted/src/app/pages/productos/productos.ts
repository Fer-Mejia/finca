import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from '../../services/productos';
import { CarritoService } from '../../services/carrito'; 
import { AuthService } from '../../services/auth'; 
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Producto } from '../../interfaces/producto'; 
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, CurrencyPipe], 
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class Productos implements OnInit {
  // --- INYECCIONES (Punto 2) ---
  private prodService = inject(ProductosService);
  private carritoSvc = inject(CarritoService);
  public authSvc = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); 

  // --- ESTADO CON SIGNALS (Punto 7 y Punto 12 aplicado) ---
  // Ahora el Signal sabe que contiene un arreglo de "Producto", no de "any"
  listaProductos = signal<Producto[]>([]); 
  textoFiltro = signal('');

  // --- LÓGICA REACTIVA ---
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
      // Al ser un servicio que trae datos de MySQL, se asignan a nuestro signal tipado
      this.listaProductos.set(data);
    });

    // 2. USO DE QUERYPARAMMAP (Punto 9)
    this.route.queryParamMap.subscribe(params => {
      const valorUrl = params.get('buscar');
      if (valorUrl) {
        this.textoFiltro.set(valorUrl);
        console.log('Punto 9 - Parámetro recuperado de la URL:', valorUrl);
      }
    });
  }

  actualizarFiltro(event: Event) {
    const elemento = event.target as HTMLInputElement;
    this.textoFiltro.set(elemento.value);
  }

  // --- PUNTO 12: Declaramos que el parámetro es de tipo Producto ---
  agregarAlCarrito(producto: Producto) {
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