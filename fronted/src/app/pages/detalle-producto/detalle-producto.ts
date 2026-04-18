import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // 1. Importación necesaria
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.css',
})
export class DetalleProducto implements OnInit {
  // 2. Inyección de ActivatedRoute usando inject() (Cumple Punto 2 y 9)
  private route = inject(ActivatedRoute);

  // Signal para guardar el ID de forma reactiva (Cumple Punto 7)
  idCapturado = signal<string | null>(null);

  ngOnInit(): void {
    // 3. USO DE PARAMMAP (Aquí es donde compruebas el Punto 9)
    // snapshot.paramMap.get('id') extrae el ":id" de la URL
    const id = this.route.snapshot.paramMap.get('id');
    this.idCapturado.set(id);

    console.log('ID recuperado de la URL:', this.idCapturado());
  }
}