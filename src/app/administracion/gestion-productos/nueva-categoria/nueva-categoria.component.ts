import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nueva-categoria',
  templateUrl: './nueva-categoria.component.html',
  styleUrls: ['./nueva-categoria.component.css'],
  standalone: true,
  imports: [FormsModule, NgClass]
})
export class NuevaCategoriaComponent implements OnInit {
  isModalOpen: boolean = false; // Propiedad para controlar la visibilidad del modal

  constructor(private router: Router) { }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  ngOnInit(): void {
    this.validateForm(); // Llamar a la función de validación del formulario al iniciar
  }

  /* Validación de los campos ******************************** */
  validateForm(): void {
    const form = document.getElementById('product-form') as HTMLFormElement;
    const errorMessage = document.getElementById('error-message') as HTMLElement;
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    const imagePreview = document.getElementById('image-preview') as HTMLElement;

    // Validación del formulario al enviarlo
    form.addEventListener('submit', (event: Event) => {
      errorMessage.textContent = '';
      errorMessage.classList.add('hidden');

      if (!form.checkValidity()) {
        event.preventDefault();
        errorMessage.textContent = 'Por favor, completa todos los campos requeridos.';
        errorMessage.classList.remove('hidden');
      }
    });
  }

  /* Modal para confirmación de descarte y regresar */
  openModal(): void {
    this.isModalOpen = true; // Cambia el estado del modal a abierto
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.isModalOpen = false; // Cambia el estado del modal a cerrado
  }

  // Confirmar acción y redirigir
  confirmDiscard(): void {
    this.closeModal();  // Cierra el modal

    // Lógica para redirigir a la ruta especificada
    this.router.navigate(['/administracion/gestion/productos/categorias']);
  }
}
