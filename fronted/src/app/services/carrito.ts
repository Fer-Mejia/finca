import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth'; 
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private http = inject(HttpClient);
  private authSvc = inject(AuthService);
  
  // URL actualizada para conectar con el backend en Render
  private urlApi = 'https://finca-sho6.onrender.com/api/pedidos';

  // 1. La lista privada de productos (Signals con LocalStorage)
  private items = signal<any[]>(JSON.parse(localStorage.getItem('carrito') || '[]'));

  // 2. Valores calculados (Computed)
  totalItems = computed(() => this.items().length);
  
  totalPrecio = computed(() => {
    return this.items().reduce((acc, item) => {
      return acc + (item.precio * (item.cantidad || 1));
    }, 0);
  });

  getCarrito() {
    return this.items();
  }

  // --- LÓGICA DE GESTIÓN ---

  agregarProducto(producto: any) {
    this.items.update(actual => {
      const index = actual.findIndex(item => item.nombre === producto.nombre);
      let nuevaLista;

      if (index !== -1) {
        nuevaLista = [...actual];
        nuevaLista[index] = { 
          ...nuevaLista[index], 
          cantidad: (nuevaLista[index].cantidad || 1) + 1 
        };
      } else {
        const nuevoItem = { ...producto, cantidad: 1 };
        nuevaLista = [...actual, nuevoItem];
      }

      localStorage.setItem('carrito', JSON.stringify(nuevaLista));
      
      // Feedback visual rápido al agregar
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Agregado al carrito',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });

      return nuevaLista;
    });
  }

  incrementarCantidad(nombre: string) {
    this.items.update(actual => {
      const nuevaLista = actual.map(item => 
        item.nombre === nombre 
          ? { ...item, cantidad: (item.cantidad || 1) + 1 } 
          : item
      );
      localStorage.setItem('carrito', JSON.stringify(nuevaLista));
      return nuevaLista;
    });
  }

  decrementarCantidad(nombre: string) {
    this.items.update(actual => {
      const itemEncontrado = actual.find(item => item.nombre === nombre);
      
      if (itemEncontrado && itemEncontrado.cantidad === 1) {
        return actual; // No hacemos nada, que use eliminarProducto
      }

      const nuevaLista = actual.map(item => 
        item.nombre === nombre 
          ? { ...item, cantidad: item.cantidad - 1 } 
          : item
      );
      localStorage.setItem('carrito', JSON.stringify(nuevaLista));
      return nuevaLista;
    });
  }

  eliminarProducto(nombre: string) {
    this.items.update(actual => {
      const nuevaLista = actual.filter(item => item.nombre !== nombre);
      localStorage.setItem('carrito', JSON.stringify(nuevaLista));
      return nuevaLista;
    });
  }

  confirmarLimpiarCarrito() {
    Swal.fire({
      title: '¿Vaciar carrito?',
      text: "Se eliminarán todos los productos de tu orden",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3e2723',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.limpiarCarrito();
        Swal.fire('Vaciado', 'Tu carrito está limpio.', 'success');
      }
    });
  }

  limpiarCarrito() {
    this.items.set([]);
    localStorage.removeItem('carrito');
  }

  // --- CONEXIÓN CON EL BACKEND ---

  finalizarCompra() {
    // 1. Validar carrito vacío
    if (this.items().length === 0) {
      Swal.fire({
        icon: 'error',
        title: '¡Carrito vacío!',
        text: 'Agrega al menos un café para continuar.',
        confirmButtonColor: '#3e2723'
      });
      return;
    }

    // 2. Obtener usuario (asumiendo que tu AuthService tiene usuarioActual())
    const usuarioLogueado = this.authSvc.usuarioActual();
    if (!usuarioLogueado) {
      Swal.fire({
        icon: 'info',
        title: 'Inicia Sesión',
        text: 'Debes estar logueado para realizar un pedido.',
        confirmButtonColor: '#3e2723'
      });
      return;
    }

    // 3. Preparar pedido
    const pedido = {
      id_usuario: usuarioLogueado.id_usuario,
      total: this.totalPrecio(),
      productos: this.items().map(p => ({
        id_producto: p.id_producto,
        cantidad: p.cantidad
      }))
    };

    // 4. Enviar al Backend en Render
    this.http.post(this.urlApi, pedido).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: '¡Pedido Realizado!',
          text: `Gracias por tu compra. Pedido #${res.id_pedido}`,
          confirmButtonColor: '#2d5a27'
        });
        this.limpiarCarrito();
      },
      error: (err) => {
        console.error('Error al enviar el pedido:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No pudimos procesar tu compra. Intenta de nuevo.',
          confirmButtonColor: '#3e2723'
        });
      }
    });
  }
}