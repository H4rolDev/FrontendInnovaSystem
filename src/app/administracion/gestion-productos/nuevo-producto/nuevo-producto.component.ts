import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductBody, Producto } from 'src/app/shared/models/producto';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf]
})
export class NuevoProductoComponent implements OnInit {
  cargaDatos: 'none' | 'loading' | 'done' | 'error' = "none";
  createProductState: 'none' | 'loading' | 'done' | 'error' = "none";
  products: Producto[] = [];
  showFormProduct: 'none' | 'edit' | 'add' = 'none';
  formProduct: FormGroup;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.formProduct = this.fb.group({
      Nombre: ['', [Validators.required]],
      Imagen: ['', [Validators.required]],
      Descripcion: ['', [Validators.required]],
      Modelo: ['', [Validators.required]],
      PrecioVenta: [null, [Validators.required, Validators.min(0)]],
      UtilidadPrecioVenta: [null, [Validators.required, Validators.min(0)]],
      UtilidadPorcentaje: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?%?$/)]],
      Stock: [null, [Validators.required, Validators.min(0)]],
      Garantia: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.listAll();
    this.validateForm();
  }

  // Implementando APIS
  listAll() {
    this.cargaDatos = 'loading';
    this.productService.list().subscribe({
      next: (data) => {
        this.cargaDatos = 'done';
        this.products = data;
      },
      error: (_) => {
        this.cargaDatos = 'error';
      }
    });
  }

  addProduct() {
    this.showFormProduct = "add";
    this.createProductState = 'none';
  }

  removeProduct(producto: Producto) {
    producto.remove = true;
  }

  confirmDelete(productId: number) {
    this.productService.remove(productId).subscribe({
      next: () => {
        this.products = this.products.filter(b => b.id != productId);
      },
      error: (err) => { }
    });
  }

  cancelDelete(product: Producto) {
    product.remove = false;
  }

  createProduct() {
    this.createProductState = 'loading';
    this.productService.create(this.formProduct.value as ProductBody).subscribe({
      next: (data) => {
        this.createProductState = 'done';
        this.products.push(data);
      },
      error: (err) => {
        this.createProductState = 'error';
      }
    });
  }

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

    // Manejo del cambio en el input de archivos
    fileInput.addEventListener('change', (event: Event) => {
      const files = (event.target as HTMLInputElement).files;
      imagePreview.innerHTML = ''; // Limpiar vista previa anterior

      if (files) {
        Array.from(files).forEach(file => {
          const reader = new FileReader();

          reader.onload = (e: ProgressEvent<FileReader>) => {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'relative inline-block m-2';

            const img = document.createElement('img');
            img.src = e.target?.result as string;
            img.className = 'h-32 w-32 object-cover rounded-md border border-gray-300';

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.className = 'absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs';
            deleteButton.onclick = () => imageContainer.remove();

            imageContainer.append(img, deleteButton);
            imagePreview.appendChild(imageContainer);
          };

          reader.readAsDataURL(file);
        });
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

  closeModal(): void {
    const modal = document.getElementById('categorias');
    if (modal) {
      modal.classList.remove('flex');
      modal.classList.add('hidden');
    }
  }

  confirmDiscard(): void {
    this.closeModal();
    this.router.navigate(['/administracion/gestion/producto/lista']);
  }
}
