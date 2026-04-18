import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; // Necesario para el formulario
import { ProductosService } from '../../services/productos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit { // Nota: Si tu clase se llama AdminComponent, cámbialo aquí
  private prodSvc = inject(ProductosService);
  private http = inject(HttpClient);
  
  listaProductos = signal<any[]>([]);

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.prodSvc.getProductos().subscribe({
      next: (data) => this.listaProductos.set(data),
      error: (err) => console.error('Error al cargar productos', err)
    });
  }

  guardarProducto(form: NgForm) {
    if (form.invalid) return;

    const nuevoProducto = form.value;

    this.http.post('http://localhost:3000/api/productos', nuevoProducto)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Añadido!',
            text: 'El nuevo café ya está en el menú',
            confirmButtonColor: '#3e2723'
          });
          this.cargarProductos(); // Refresca la tabla
          form.reset(); // Limpia el formulario
          
          // Cerrar el modal automáticamente
          const closeBtn = document.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
          closeBtn?.click();
        },
        error: (err) => {
          Swal.fire('Error', 'No se pudo guardar el producto', 'error');
        }
      });
  }

  eliminarProducto(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "El producto desaparecerá de la tienda",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3e2723',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:3000/api/productos/${id}`).subscribe({
          next: () => {
            this.cargarProductos(); 
            Swal.fire('¡Eliminado!', 'Producto quitado con éxito.', 'success');
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar', 'error')
        });
      }
    });
  }
}