import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductBody, Producto } from 'src/app/shared/models/producto';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule, CurrencyPipe]
})
export class ListaProductosComponent implements OnInit {
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
    // Llamando la API
    this.listAll();

    this.modalEdit = document.getElementById("modalEdit");
    this.btnCloseEdit = document.getElementById("btnCloseEdit");
    this.btnCancelEdit = document.getElementById("btnCancelEdit");
    this.btnSaveEdit = document.getElementById("btnSaveEdit");

    // Inicializa los eventos del modal de edición
    this.initializeEventListeners();

    // Inicializa los eventos del modal de confirmación
    this.initializeConfirmButtons();
  }

  // Implementando APIS
  listAll() {
    this.cargaDatos = 'loading';
    this.productService.list().subscribe({
      next: (data) => {
        this.cargaDatos = 'done',
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

  removeProduct(product: Producto) {
    this.productService.remove(product.id).subscribe(() => {
      this.products = this.products.filter(b => b.id !== product.id);
      console.log('Marca eliminada');
    }, (err) => {
      console.error('Error al eliminar la marca', err);
    });
  }

  confirmDelete(productId: number) {
    this.productService.remove(productId).subscribe({
      next: (res) => {
        this.products = this.products.filter(b => b.id != productId);
      },
      error: (err) => { }
    });
  }

  cancelDelete(product: Producto) {
    product.remove = false;
  }

  createProduct() {
    console.log(this.formProduct);
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

  // Propiedades del modal de edición
  modalEdit!: HTMLElement | null;
  btnCloseEdit!: HTMLElement | null;
  btnCancelEdit!: HTMLElement | null;
  btnSaveEdit!: HTMLElement | null;

  initializeEventListeners(): void {
    if (this.modalEdit && this.btnCloseEdit && this.btnCancelEdit && this.btnSaveEdit) {
      this.btnCloseEdit.addEventListener("click", this.openConfirmClearModal.bind(this));
      document.querySelectorAll('.btnOpenModal').forEach(button => {
        button.addEventListener('click', this.openModalEdit.bind(this));
      });

      this.btnCancelEdit.addEventListener("click", this.openConfirmClearModal.bind(this));
      this.btnSaveEdit.addEventListener("click", this.saveModalEdit.bind(this));
    }
  }

  openModalEdit(event: Event): void {
    event.preventDefault();
    if (this.modalEdit) {
      this.modalEdit.classList.remove("hidden");
    }
  }

  closeModalEdit(): void {
    if (this.modalEdit) {
      this.modalEdit.classList.add("hidden");
    }
  }

  saveModalEdit(): void {
    const form = document.querySelector('form') as HTMLFormElement;

    if (form.checkValidity()) {
      console.log('Formulario válido, guardando cambios...');
      if (this.modalEdit) {
        this.modalEdit.classList.add("hidden");
      }
    } else {
      form.reportValidity();
      console.log('Formulario inválido, por favor complete todos los campos requeridos.');
    }
  }

  openConfirmClearModal(): void {
    const confirmClearModal = document.getElementById("confirm-clear-modal");
    if (confirmClearModal) {
      confirmClearModal.classList.remove("hidden");
    }
  }

  closeConfirmClearModal(): void {
    const confirmClearModal = document.getElementById("confirm-clear-modal");
    if (confirmClearModal) {
      confirmClearModal.classList.add("hidden");
    }
  }

  confirmClear(): void {
    const form = document.querySelector('form') as HTMLFormElement;

    if (form) {
      form.reset();
    }

    this.closeConfirmClearModal();

    if (this.modalEdit) {
      this.modalEdit.classList.add("hidden");
    }

    console.log('Cambios desechados y formulario cerrado.');
  }

  initializeConfirmButtons(): void {
    const btnOpenModal = document.querySelector(".btn-open-confirm") as HTMLButtonElement;
    const btnConfirmYes = document.getElementById("btn-confirm-yes") as HTMLButtonElement;
    const btnConfirmNo = document.getElementById("btn-confirm-no") as HTMLButtonElement;

    if (btnOpenModal) {
      btnOpenModal.addEventListener("click", () => this.openConfirmClearModal());
    }

    if (btnConfirmYes) {
      btnConfirmYes.addEventListener("click", () => this.confirmClear());
    }

    if (btnConfirmNo) {
      btnConfirmNo.addEventListener("click", () => this.closeConfirmClearModal());
    }
  }

  /* Este es el unico codigo para desplegar el filtro de busqueda de ventas */
  isDropdownOpen: boolean = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
