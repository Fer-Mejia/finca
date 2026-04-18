import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms'; // Cambiamos FormsModule por Reactive
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // <-- Punto 11: ReactiveFormsModule
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.css']
})
export class Contacto {
  private fb = inject(FormBuilder); // Punto 2: Uso de inject

  // Punto 11: Definición del Formulario Reactivo
  // Punto 12/13: Agregamos validaciones (mínimo 3 por campo donde sea posible)
  miFormulario = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]*$')]],
    email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    asunto: ['Queja o Sugerencia', [Validators.required]],
    mensaje: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
  });

  enviarMensaje() {
    if (this.miFormulario.valid) {
      const { nombre } = this.miFormulario.value;
      
      Swal.fire({
        icon: 'success',
        title: '¡Mensaje enviado!',
        text: `Gracias ${nombre}, nos pondremos en contacto pronto.`,
        confirmButtonColor: '#198754' 
      });

      this.miFormulario.reset({
        asunto: 'Queja o Sugerencia'
      });
    }
  }
}