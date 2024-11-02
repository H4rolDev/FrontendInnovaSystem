import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Brand, BrandBody } from 'src/app/shared/models/brand';
import { BrandService } from 'src/app/shared/services/brand.service';

@Component({
  selector: 'app-nueva-marca',
  templateUrl: './nueva-marca.component.html',
  styleUrls: ['./nueva-marca.component.css'],
  standalone: true,
  imports: [FormsModule, NgClass, ReactiveFormsModule]
})
export class NuevaMarcaComponent implements OnInit {
  cargaDatos: 'none' | 'loading' | 'done' | 'error' = "none";
  createBrandState: 'none' | 'loading' | 'done' | 'error' = "none";
  brands: Brand[] = [];
  showFormBrand: 'none' | 'edit' | 'add' = 'none';
  formBrand: FormGroup;
  constructor(
    private brandService: BrandService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.formBrand = this.fb.group({
      name: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]]
    });

  }

  ngOnInit(): void {
    // Llamar a la función de validación del formulario al iniciar
    this.validateForm(); 
  }

  addBrand() {
    this.showFormBrand = "add";
    this.createBrandState = 'none';
  }

  createBrand(){
    console.log(this.formBrand);
    this.createBrandState = 'loading';
    this.brandService.create(this.formBrand.value as BrandBody).subscribe({
      next: (data) => {
        this.createBrandState = 'done';
        // this.listAll();
        this.brands.push(data);
      },
      error: (err) => {
        this.createBrandState = 'error';
      }
    });
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

  // Método para cerrar el modal
  closeModal(): void {
    const modal = document.getElementById('categorias');
    if (modal) {
      modal.classList.remove('flex');
      modal.classList.add('hidden');
    }
  }

  // Confirmar acción y redirigir
  confirmDiscard(): void {
    this.closeModal();  // Cierra el modal

    // Lógica para redirigir a la ruta especificada
    this.router.navigate(['/administracion/gestion/productos/marcas']);
  }
}

