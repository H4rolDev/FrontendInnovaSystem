import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Marca, MarcaBody } from 'src/app/shared/models/marca';
import { BrandService } from 'src/app/shared/services/brand.service';

@Component({
  selector: 'app-nueva-marca',
  templateUrl: './nueva-marca.component.html',
  styleUrls: ['./nueva-marca.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf]
})
export class NuevaMarcaComponent implements OnInit {
  cargaDatos: 'none' | 'loading' | 'done' | 'error' = "none";
  createBrandState: 'idle' | 'loading' | 'done' | 'error' = 'idle';
  showConfirmationModal = false;
  brands: Marca[] = [];
  showFormBrand: 'none' | 'edit' | 'add' = 'none';
  formBrand: FormGroup;
  constructor(
    private brandService: BrandService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.formBrand = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      estado: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    // Llamar a la función de validación del formulario al iniciar
    this.validateForm(); 
  }

  createBrand() {
    console.log(this.formBrand);
    this.createBrandState = 'loading';
    this.brandService.create(this.formBrand.value).subscribe({
      next: (data) => {
        this.createBrandState = 'done';
        this.showConfirmationModal = true; // Muestra el modal de confirmación
        this.formBrand.reset(); // Limpia el formulario
        this.formBrand.patchValue({ estado: true }); // Restaura estado a true
      },
      error: (err) => {
        this.createBrandState = 'error';
      }
    });
  }

  closeModal() {
    this.showConfirmationModal = false;
  }

  // --------------------------------------------------------------- //

  navigateTo(route: string) {
    this.router.navigate([route]);
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
    this.router.navigate(['/administracion/gestion/productos/marcas']);
  }

  hideConfirmationModal() {
    const confirmModal = document.getElementById('confirm-clear-modal');
    confirmModal?.classList.add('hidden');
    this.router.navigate(['administracion/gestion/productos/marcas']); // Redirige a la lista de marcas
  }

  cancelarCreacion(): void {
    this.router.navigate(['administracion/gestion/productos/marcas']); // Ajusta la ruta según tu configuración
  }
}

