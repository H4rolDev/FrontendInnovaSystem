import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category, CategoryBody } from 'src/app/shared/models/category';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule]
})
export class CategoriasComponent implements OnInit {
  cargaDatos: 'none' | 'loading' | 'done' | 'error' = "none";
  createCategoryState: 'none' | 'loading' | 'done' | 'error' = "none";
  showFormCategory: 'none' | 'edit' | 'add' = 'none';
  categorys: Category[] = [];
  modalEdit!: HTMLElement | null;
  confirmClearModal!: HTMLElement | null;
  btnCloseEdit!: HTMLElement | null;
  btnCancelEdit!: HTMLElement | null;
  btnSaveEdit!: HTMLElement | null;
  btnConfirmYes!: HTMLButtonElement | null;
  btnConfirmNo!: HTMLButtonElement | null;
  formCategory: FormGroup;
  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) { 
    this.formCategory = this.fb.group({
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
    this.categoryService.list().subscribe({
      next: (data) => {
        this.cargaDatos = 'done',
        this.categorys = data;
      },
      error: (_) => {
        this.cargaDatos = 'error';
      }
    });
  }

  addCategory(){
    this.showFormCategory = "add";
    this.createCategoryState = 'none';
  }

  removeBrand(category: Category) {
    category.remove = true;
  }

  confirmDelete(categoryId: number) {
    this.categoryService.remove(categoryId).subscribe({
      next: (res) => {
        // this.listAll();
        this.categorys = this.categorys.filter(b => b.id != categoryId);
      },
      error: (err) => {}
    });
  }
  
  cancelDelete(category: Category) {
    category.remove = false;
  }

  createCategory(){
    console.log(this.formCategory);
    this.createCategoryState = 'loading';
    this.categoryService.create(this.formCategory.value as CategoryBody).subscribe({
      next: (data) => {
        this.createCategoryState = 'done';
        // this.listAll();
        this.categorys.push(data);
      },
      error: (err) => {
        this.createCategoryState = 'error';
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