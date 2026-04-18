import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.html'
})
export class HistorialComponent {
  private http = inject(HttpClient);
  private authSvc = inject(AuthService);
  
  pedidos = signal<any[]>([]);
  detallesPedido = signal<any[]>([]);

  constructor() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    const usuario = this.authSvc.usuarioActual();
    if (usuario) {
      this.http.get<any[]>(`http://localhost:3000/api/pedidos/${usuario.id_usuario}`)
        .subscribe({
          next: (data) => this.pedidos.set(data),
          error: (err) => console.error('Error al cargar historial', err)
        });
    }
  }

  verDetalles(id_pedido: number) {
    this.http.get<any[]>(`http://localhost:3000/api/pedidos/detalle/${id_pedido}`)
      .subscribe({
        next: (data) => {
          this.detallesPedido.set(data);
        },
        error: (err) => {
          console.error('Error en la petición:', err);
          Swal.fire({
            icon: 'error',
            title: 'No se pudieron ver los detalles',
            text: 'Inténtalo de nuevo más tarde.',
            confirmButtonColor: '#3e2723'
          });
        }
      });
  }

  pagar(id_pedido: number) {
    this.http.put('http://localhost:3000/api/pedidos/pagar', { id_pedido })
      .subscribe({
        next: (res: any) => {
          // Alerta de éxito al pagar
          Swal.fire({
            icon: 'success',
            title: '¡Pago procesado!',
            text: 'Tu pedido ahora está en preparación. ¡Gracias! ☕',
            confirmButtonColor: '#198754'
          });
          this.cargarHistorial(); 
        },
        error: (err) => {
          console.error('Error al pagar:', err);
          Swal.fire({
            icon: 'error',
            title: 'Pago fallido',
            text: 'No pudimos procesar el pago. Revisa tu conexión.',
            confirmButtonColor: '#3e2723'
          });
        }
      });
  }

  generarTicket(pedido: any) {
    // 1. Mostrar alerta de carga
    Swal.fire({
      title: 'Generando Ticket...',
      text: 'Preparando el archivo PDF',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Colores de marca
    const colorCafe: [number, number, number] = [62, 39, 35]; 
    const colorVerde: [number, number, number] = [45, 90, 39];

    // --- Diseño Base ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(colorCafe[0], colorCafe[1], colorCafe[2]);
    doc.text('LA FINCA', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Café de Especialidad', 105, 25, { align: 'center' });
    doc.line(20, 32, 190, 32);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`TICKET DE COMPRA: #${pedido.id_pedido}`, 20, 42);
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date(pedido.fecha).toLocaleString()}`, 20, 49);

    // --- 2. Petición de Detalles ---
    this.http.get<any[]>(`http://localhost:3000/api/pedidos/detalle/${pedido.id_pedido}`)
      .subscribe({
        next: (detalles) => {
          // Si no llegan detalles, avisamos
          if (!detalles || detalles.length === 0) {
            Swal.fire('Error', 'No se encontraron productos en este pedido', 'error');
            return;
          }

          // Mapeo de datos para la tabla
          const bodyTable = detalles.map(item => [
            item.nombre,
            { content: item.cantidad, styles: { halign: 'center' } },
            { content: `$${Number(item.precio).toFixed(2)}`, styles: { halign: 'right' } },
            { content: `$${(Number(item.cantidad) * Number(item.precio)).toFixed(2)}`, styles: { halign: 'right', fontStyle: 'bold' } }
          ]);

          // Generación de la tabla
          autoTable(doc, {
            startY: 60,
            margin: { horizontal: 20 },
            head: [['Producto', 'Cant.', 'Precio Unit.', 'Subtotal']],
            body: bodyTable,
            theme: 'striped',
            headStyles: { fillColor: colorCafe, textColor: [255, 255, 255] },
          });

          // --- 3. Total Final ---
          const finalY = (doc as any).lastAutoTable.finalY || 100;
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('TOTAL:', 140, finalY + 15, { align: 'right' });
          
          doc.setTextColor(colorVerde[0], colorVerde[1], colorVerde[2]);
          doc.setFontSize(22);
          doc.text(`$${Number(pedido.total).toFixed(2)}`, 190, finalY + 15, { align: 'right' });

          // --- 4. Guardar y Cerrar Alertas ---
          doc.save(`Ticket_LaFinca_#${pedido.id_pedido}.pdf`);
          Swal.close(); 
          
          Swal.fire({
            icon: 'success',
            title: '¡Listo!',
            text: 'Tu ticket se ha descargado.',
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (err) => {
          console.error("Error al obtener detalles:", err);
          Swal.close();
          Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
      });
  }
}