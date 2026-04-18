import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.css']
})
export class Contacto {
  // Objeto para capturar los datos del formulario
  datosContacto = {
    nombre: '',
    email: '',
    asunto: 'Queja o Sugerencia',
    mensaje: ''
  };

  enviarMensaje() {
    
    Swal.fire({
      icon: 'success',
      title: '¡Mensaje enviado!',
      text: `Gracias ${this.datosContacto.nombre}, nos pondremos en contacto pronto.`,
      confirmButtonColor: '#198754' 
    });

    // Opcional: Limpiar el formulario después de enviar
    this.datosContacto = {
      nombre: '',
      email: '',
      asunto: 'Queja o Sugerencia',
      mensaje: ''
    };
  }
} 