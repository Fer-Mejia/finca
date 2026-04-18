import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductosService } from '../../services/productos';
import { Producto } from '../../interfaces/producto'; // IMPORTAMOS LA INTERFAZ
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  private prodSvc = inject(ProductosService);
  private http = inject(HttpClient);
  
  // 2. APLICAMOS LA INTERFAZ AL SIGNAL (Punto 12)
  listaProductos = signal<Producto[]>([]);
  isEditing = signal<boolean>(false);
  idProductoSeleccionado = signal<number | null>(null);

  // 3. TIPAMOS EL OBJETO AUXILIAR (Sin el ID, porque es para el formulario)
  // Opcional: puedes usar Partial<Producto> o definirlo así:
  productoActual: Omit<Producto, 'id_producto'> = {
    nombre: '',
    precio: 0,
    imagen: '',
    descripcion: '',
    stock: 0
  };

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.prodSvc.getProductos().subscribe({
      next: (data: Producto[]) => this.listaProductos.set(data), // Tipado en la respuesta
      error: (err) => console.error('Error al cargar productos', err)
    });
  }

  prepararNuevo() {
    this.isEditing.set(false);
    this.idProductoSeleccionado.set(null);
    this.productoActual = { 
      nombre: '', 
      precio: 0, 
      imagen: '', 
      descripcion: '',
      stock: 0 
    };
  }


  prepararEdicion(p: Producto) {
    this.isEditing.set(true);
    this.idProductoSeleccionado.set(p.id_producto);
    
    this.productoActual = { 
      nombre: p.nombre,
      precio: p.precio,
      imagen: p.imagen,
      descripcion: p.descripcion,
      stock: p.stock ?? 0 
    };
  }

  guardarProducto(form: NgForm) {
    if (form.invalid) return;
    
    // Aquí el objeto 'datos' ya cumple con la estructura de la interfaz
    const datos = form.value;

    if (this.isEditing()) {
      this.http.put(`http://localhost:3000/api/productos/${this.idProductoSeleccionado()}`, datos)
        .subscribe({
          next: () => {
            Swal.fire('¡Actualizado!', 'Café modificado con éxito', 'success');
            this.finalizarProceso(form);
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo actualizar', 'error');
          }
        });
    } else {
      this.http.post('http://localhost:3000/api/productos', datos)
        .subscribe({
          next: () => {
            Swal.fire('¡Añadido!', 'Nuevo café en el menú', 'success');
            this.finalizarProceso(form);
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo guardar', 'error');
          }
        });
    }
  }

  finalizarProceso(form: NgForm) {
    this.cargarProductos();
    form.reset();
    const closeBtn = document.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
    closeBtn?.click();
  }

  eliminarProducto(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3e2723',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:3000/api/productos/${id}`).subscribe({
          next: () => {
            this.cargarProductos();
            Swal.fire('¡Eliminado!', 'Producto quitado del sistema.', 'success');
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el producto', 'error')
        });
      }
    });
  }
}