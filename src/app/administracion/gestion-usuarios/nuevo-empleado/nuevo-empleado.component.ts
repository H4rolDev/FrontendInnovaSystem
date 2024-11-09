import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Trabajador } from 'src/app/shared/models/empleado';
import { EmployeeService } from 'src/app/shared/services/employee.service';

@Component({
  selector: 'app-nuevo-empleado',
  templateUrl: './nuevo-empleado.component.html',
  styleUrls: ['./nuevo-empleado.component.css'],
  standalone: true,
  imports: [FormsModule, FormsModule, ReactiveFormsModule, NgIf]
})

export class NuevoEmpleadoComponent implements OnInit {
  cargaDatos: 'none' | 'loading' | 'done' | 'error' = "none";
  createTrabajadorState: 'idle' | 'loading' | 'done' | 'error' = 'idle';
  showConfirmationModal = false;
  trabajadores: Trabajador[] = [];
  showFormTrabajador: 'none' | 'edit' | 'add' = 'none';
  formTrabajador: FormGroup;
  constructor(
    private trabajadorService: EmployeeService,
    private fb: FormBuilder,
    private router: Router
  ) {this.formTrabajador = this.fb.group({
  });}


  createTrabajador() {
    console.log(this.formTrabajador);
    this.createTrabajadorState = 'loading';
    this.trabajadorService.create(this.formTrabajador.value).subscribe({
      next: (data) => {
        this.createTrabajadorState = 'done';
        this.showConfirmationModal = true; // Muestra el modal de confirmación
        this.formTrabajador.reset(); // Limpia el formulario
        this.formTrabajador.patchValue({ estado: true }); // Restaura estado a true
      },
      error: (err) => {
        this.createTrabajadorState = 'error';
      }
    });
  }

  closeModal() {
    this.showConfirmationModal = false;
  }






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
    this.router.navigate(['/administracion/gestion/usuarios/empleados']);
  }



  hideConfirmationModal() {
    const confirmModal = document.getElementById('confirm-clear-modal');
    confirmModal?.classList.add('hidden');
    this.router.navigate(['/administracion/gestion/usuarios/empleados']); // Redirige a la lista de marcas
  }

  cancelarCreacion(): void {
    this.router.navigate(['a/administracion/gestion/usuarios/empleados']); // Ajusta la ruta según tu configuración
  }
}

