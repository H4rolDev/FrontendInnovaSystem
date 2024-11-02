import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Brand, BrandBody } from 'src/app/shared/models/brand';
import { BrandService } from 'src/app/shared/services/brand.service';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule]
})
export class MarcasComponent implements OnInit {
  cargaDatos: 'none' | 'loading' | 'done' | 'error' = "none";
  createBrandState: 'none' | 'loading' | 'done' | 'error' = "none";
  showFormBrand: 'none' | 'edit' | 'add' = 'none';
  brands: Brand[] = [];
  modalEdit!: HTMLElement | null;
  confirmClearModal!: HTMLElement | null;
  btnCloseEdit!: HTMLElement | null;
  btnCancelEdit!: HTMLElement | null;
  btnSaveEdit!: HTMLElement | null;
  btnConfirmYes!: HTMLButtonElement | null;
  btnConfirmNo!: HTMLButtonElement | null;
  formBrand: FormGroup;

  constructor(
    private router: Router,
    private brandService: BrandService,
    private fb: FormBuilder
  ) {
    this.formBrand = this.fb.group({
      name: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]]
    });
   }

  ngOnInit(): void {
    // Aplicando las APIs
    this.listAll();

    // Asigna los elementos del DOM
    this.assignDOMElements();
    this.initializeEventListeners();
  }

  // Aplicando las APIs
  listAll(){
    this.cargaDatos = 'loading';
    this.brandService.list().subscribe({
      next: (data) => {
        this.cargaDatos = 'done',
        this.brands = data;
      },
      error: (_) => {
        this.cargaDatos = 'error';
      }
    });
  }

  addBrand(){
    this.showFormBrand = "add";
    this.createBrandState = 'none';
  }

  removeBrand(brand: Brand) {
    brand.remove = true;
  }

  confirmDelete(brandId: number) {
    this.brandService.remove(brandId).subscribe({
      next: (res) => {
        // this.listAll();
        this.brands = this.brands.filter(b => b.id != brandId);
      },
      error: (err) => {}
    });
  }
  
  cancelDelete(brand: Brand) {
    brand.remove = false;
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

  // Asigna referencias a los elementos del DOM
  private assignDOMElements(): void {
    this.modalEdit = document.getElementById("modalEdit");
    this.confirmClearModal = document.getElementById("confirm-clear-modal");
    this.btnCloseEdit = document.getElementById("btnCloseEdit");
    this.btnCancelEdit = document.getElementById("btnCancelEdit");
    this.btnSaveEdit = document.getElementById("btnSaveEdit");
    this.btnConfirmYes = document.getElementById("btn-confirm-yes") as HTMLButtonElement;
    this.btnConfirmNo = document.getElementById("btn-confirm-no") as HTMLButtonElement;
  }

  // Inicializa todos los eventos de los botones
  private initializeEventListeners(): void {
    // Eventos del modal de edición
    if (this.btnCloseEdit && this.btnCancelEdit && this.btnSaveEdit) {
      this.btnCloseEdit.addEventListener("click", this.openConfirmClearModal.bind(this));
      this.btnCancelEdit.addEventListener("click", this.openConfirmClearModal.bind(this));
      this.btnSaveEdit.addEventListener("click", this.saveModalEdit.bind(this));
    }

    // Botones de apertura del modal de edición
    document.querySelectorAll('.btnOpenModal').forEach(button => {
      button.addEventListener('click', this.openModalEdit.bind(this));
    });

    // Eventos del modal de confirmación
    if (this.btnConfirmYes) {
      this.btnConfirmYes.addEventListener("click", () => this.confirmClear());
    }
    if (this.btnConfirmNo) {
      this.btnConfirmNo.addEventListener("click", () => this.closeConfirmClearModal());
    }
  }

  // Navega a una ruta específica
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  // Abre el modal de edición para modificar productos
  openModalEdit(event: Event): void {
    event.preventDefault();
    if (this.modalEdit) {
      this.modalEdit.classList.remove("hidden");
    }
  }

  // Cierra el modal de edición
  closeModalEdit(): void {
    if (this.modalEdit) {
      this.modalEdit.classList.add("hidden");
    }
  }

  // Valida y guarda los cambios hechos en el modal de edición
  saveModalEdit(): void {
    const form = document.querySelector('form') as HTMLFormElement;

    if (form.checkValidity()) {
      console.log('Formulario válido, guardando cambios...');
      this.closeModalEdit();
    } else {
      form.reportValidity();
      console.log('Formulario inválido, por favor complete todos los campos requeridos.');
    }
  }

  // Muestra el modal de confirmación para deshacer cambios
  openConfirmClearModal(): void {
    if (this.confirmClearModal) {
      this.confirmClearModal.classList.remove("hidden");
    }
  }

  // Oculta el modal de confirmación
  closeConfirmClearModal(): void {
    if (this.confirmClearModal) {
      this.confirmClearModal.classList.add("hidden");
    }
  }

  // Confirma el reseteo del formulario y cierra los modales
  confirmClear(): void {
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      form.reset();
    }
    this.closeConfirmClearModal();
    this.closeModalEdit();
    console.log('Cambios desechados y formulario cerrado.');
  }
  /* Este es el unico codigo para desplegar el filtro de busqueda de ventas */
  isDropdownOpen: boolean = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
