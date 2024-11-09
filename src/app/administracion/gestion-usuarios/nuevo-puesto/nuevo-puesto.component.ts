import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PuestoService } from 'src/app/shared/services/puesto.service';

@Component({
  selector: 'app-nuevo-puesto',
  templateUrl: './nuevo-puesto.component.html',
  styleUrls: ['./nuevo-puesto.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf]
})
export class NuevoPuestoComponent implements OnInit {
  cargaDatos: 'none' | 'loading' | 'done' | 'error' = "none";
  createPuestoState: 'idle' | 'loading' | 'done' | 'error' = 'idle';
  showConfirmationModal = false;
  showFormPuesto: 'none' | 'edit' | 'add' = 'none';
  formPuesto: FormGroup;
  constructor(
    private puestoService: PuestoService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.formPuesto = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      salarioBase: ['', [Validators.required, Validators.min(1024), Validators.max(10000)]],
      estado: [true, Validators.required],
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  createPuesto() {
    console.log(this.formPuesto);
    this.createPuestoState = 'loading';
    this.puestoService.create(this.formPuesto.value).subscribe({
      next: (data) => {
        this.createPuestoState = 'done';
        this.showConfirmationModal = true; // Muestra el modal de confirmación
        this.formPuesto.reset(); // Limpia el formulario
        this.formPuesto.patchValue({ estado: true }); // Restaura estado a true
      },
      error: (err) => {
        this.createPuestoState = 'error';
      }
    });
  }

  closeModal() {
    this.showConfirmationModal = false;
  }

  hideConfirmationModal() {
    const confirmModal = document.getElementById('confirm-clear-modal');
    confirmModal?.classList.add('hidden');
    this.router.navigate(['administracion/gestion/usuarios/puestos']); // Redirige a la lista de marcas
  }

  cancelarCreacion(): void {
    this.router.navigate(['administracion/gestion/usuarios/puestos']); // Ajusta la ruta según tu configuración
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
  /* modal para confirmacion de descarte y regresar*/
  openModal(): void {
    const modal = document.getElementById('categorias');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  // Confirmar acción y redirigir
  confirmDiscard(): void {
    this.closeModal();  // Cierra el modal

    // Lógica para redirigir a la ruta especificada
    this.router.navigate(['administracion/gestion/usuarios/puestos']);
  }
}

