import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductosService } from '../../services/productos';
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
  
  // Señales para el estado de la pantalla
  listaProductos = signal<any[]>([]);
  isEditing = signal<boolean>(false);
  idProductoSeleccionado = signal<number | null>(null);

  // Estructura del objeto actual con stock incluido
  productoActual = {
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
      next: (data) => this.listaProductos.set(data),
      error: (err) => console.error('Error al cargar productos', err)
    });
  }

  // --- Limpiar el formulario para un nuevo registro ---
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

  // --- Cargar datos en el formulario para editar ---
  prepararEdicion(p: any) {
    this.isEditing.set(true);
    this.idProductoSeleccionado.set(p.id_producto);
    
    // Copiamos todas las propiedades (incluyendo stock) de forma segura
    this.productoActual = { 
      nombre: p.nombre,
      precio: p.precio,
      imagen: p.imagen,
      descripcion: p.descripcion,
      stock: p.stock ?? 0 // Si es null en la DB, le pone 0
    };
  }

  // --- Guardar (Crear o Editar) ---
  guardarProducto(form: NgForm) {
    if (form.invalid) return;
    
    // Obtenemos los datos del formulario (incluye el stock)
    const datos = form.value;

    if (this.isEditing()) {
      // ACTUALIZAR (PUT)
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
      // CREAR (POST)
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

  // --- Cerrar modal y refrescar tabla ---
  finalizarProceso(form: NgForm) {
    this.cargarProductos();
    form.reset();
    const closeBtn = document.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
    closeBtn?.click();
  }

  // --- Eliminar ---
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