import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { CommonModule, CurrencyPipe } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.html',
  styleUrl: './historial.css'
})
export class HistorialComponent {
  private http = inject(HttpClient);
  private authSvc = inject(AuthService);
  
  // URL base de Render para Pedidos
  private urlApi = 'https://finca-sho6.onrender.com/api/pedidos';
  
  // Signals para manejar el estado de la vista
  pedidos = signal<any[]>([]);
  detallesPedido = signal<any[]>([]);

  constructor() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    const usuario = this.authSvc.usuarioActual();
    if (usuario) {
      // Cambio de localhost a Render
      this.http.get<any[]>(`${this.urlApi}/${usuario.id_usuario}`)
        .subscribe({
          next: (data) => this.pedidos.set(data),
          error: (err) => console.error('Error al cargar historial', err)
        });
    }
  }

  // --- VER DETALLES EN EL MODAL ---
  verDetalles(id_pedido: any) {
    // Cambio de localhost a Render
    this.http.get<any[]>(`${this.urlApi}/detalle/${id_pedido}`)
      .subscribe({
        next: (data) => {
          console.log('Datos recibidos del servidor:', data);
          if (data && data.length > 0) {
            this.detallesPedido.set(data);
          } else {
            this.detallesPedido.set([]);
            console.warn('El pedido no tiene productos asociados.');
          }
        },
        error: (err) => {
          console.error('Error al conectar con la API:', err);
          this.detallesPedido.set([]);
        }
      });
  }

  // --- PROCESAR PAGO ---
  pagar(id_pedido: number) {
    // Cambio de localhost a Render
    this.http.put(`${this.urlApi}/pagar`, { id_pedido })
      .subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: '¡Pago exitoso!',
            text: 'Tu pedido está en camino. ☕',
            confirmButtonColor: '#3e2723'
          });
          this.cargarHistorial(); 
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error en el pago',
            text: 'No se pudo procesar la transacción.',
            confirmButtonColor: '#3e2723'
          });
        }
      });
  }

  // --- GENERAR PDF ---
  generarTicket(pedido: any) {
    Swal.fire({
      title: 'Generando Ticket...',
      text: 'Preparando tu comprobante de La Finca',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const doc = new jsPDF();
    const colorCafe: [number, number, number] = [62, 39, 35];

    // Cambio de localhost a Render
    this.http.get<any[]>(`${this.urlApi}/detalle/${pedido.id_pedido}`)
      .subscribe({
        next: (detallesServidor) => {
          doc.setFontSize(22);
          doc.setTextColor(colorCafe[0], colorCafe[1], colorCafe[2]);
          doc.text('LA FINCA - CAFETERÍA', 105, 20, { align: 'center' });
          
          doc.setFontSize(12);
          doc.setTextColor(0);
          doc.text(`TICKET DE COMPRA: #${pedido.id_pedido}`, 20, 40);
          doc.text(`Fecha: ${new Date(pedido.fecha).toLocaleString()}`, 20, 47);

          const bodyTable = detallesServidor.map(item => [
            item.nombre,
            item.cantidad,
            `$${Number(item.precio).toFixed(2)}`,
            `$${(Number(item.cantidad) * Number(item.precio)).toFixed(2)}`
          ]);

          autoTable(doc, {
            startY: 55,
            head: [['Producto', 'Cant.', 'Precio Unit.', 'Subtotal']],
            body: bodyTable,
            headStyles: { fillColor: colorCafe },
            theme: 'striped'
          });

          const finalY = (doc as any).lastAutoTable.finalY || 100;
          doc.setFontSize(16);
          doc.text(`TOTAL: $${Number(pedido.total).toFixed(2)}`, 190, finalY + 15, { align: 'right' });

          doc.save(`Ticket_LaFinca_#${pedido.id_pedido}.pdf`);
          Swal.close();
        },
        error: (err) => {
          Swal.close();
          Swal.fire('Error', 'No se pudo generar el archivo PDF.', 'error');
        }
      });
  }
}