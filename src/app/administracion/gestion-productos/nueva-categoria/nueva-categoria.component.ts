import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from 'src/app/shared/models/category';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-nueva-categoria',
  templateUrl: './nueva-categoria.component.html',
  styleUrls: ['./nueva-categoria.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf]
})
export class NuevaCategoriaComponent implements OnInit {
  cargaDatos: 'none' | 'loading' | 'done' | 'error' = "none";
  createCategoryState: 'idle' | 'loading' | 'done' | 'error' = 'idle';
  showConfirmationModal = false;
  categorys: Category[] = [];
  showFormCategory: 'none' | 'edit' | 'add' = 'none';
  formCategory: FormGroup;
  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.formCategory = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      estado: [true, Validators.required]
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  ngOnInit(): void {
    this.validateForm(); // Llamar a la función de validación del formulario al iniciar
  }

  createCategory() {
    console.log(this.formCategory);
    this.createCategoryState = 'loading';
    this.categoryService.create(this.formCategory.value).subscribe({
      next: (data) => {
        this.createCategoryState = 'done';
        this.showConfirmationModal = true; // Muestra el modal de confirmación
        this.formCategory.reset(); // Limpia el formulario
        this.formCategory.patchValue({ estado: true }); // Restaura estado a true
      },
      error: (err) => {
        this.createCategoryState = 'error';
      }
    });
  }

  closeModal() {
    this.showConfirmationModal = false;
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
    this.router.navigate(['/administracion/gestion/productos/categorias']);
  }

  hideConfirmationModal() {
    const confirmModal = document.getElementById('confirm-clear-modal');
    confirmModal?.classList.add('hidden');
    this.router.navigate(['administracion/gestion/productos/categorias']); // Redirige a la lista de marcas
  }

  cancelarCreacion(): void {
    this.router.navigate(['administracion/gestion/productos/categorias']); // Ajusta la ruta según tu configuración
  }
}
