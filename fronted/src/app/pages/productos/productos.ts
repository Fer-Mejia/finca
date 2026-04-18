import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ProductosService } from '../../services/productos';
import { CarritoService } from '../../services/carrito'; 
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
    // 1. Ejecutamos la lógica del carrito
    this.carritoSvc.agregarProducto(producto);

    // 2. Mostramos el Toast elegante
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