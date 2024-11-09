import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category, CategoryBody } from 'src/app/shared/models/category';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule, ReactiveFormsModule]
})
export class CategoriasComponent implements OnInit {
  isModalOpen = false; 
  selectedCategory: Category | null = null; 

  mostrarModal = false;
  mensajeConfirmacion = '';
  confirmacionId: number | null = null;
  nuevoEstadoConfirmacion: boolean = false;
  selectedCategoryId: number | null = null; // ID de la marca seleccionada para editar
  updateCategoryState = 'idle';


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
  formEditCategory: FormGroup;
  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.formEditCategory = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      estado: ['', Validators.required]
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

  // Función para confirmar la eliminación
  confirmDelete(categoryId: number) {
    // Buscar la marca en el arreglo usando el id
    const category = this.categorys.find(b => b.id === categoryId);
    if (category) {
      this.categoryService.remove(categoryId).subscribe({
        next: (res) => {
          // Eliminar la marca del arreglo
          this.categorys = this.categorys.filter(b => b.id !== categoryId);
          category.remove = false;  // Cerrar el modal
        },
        error: (err) => {
          console.error('Error al eliminar la categoria', err);
          category.remove = false;  // Cerrar el modal en caso de error
        }
      });
    }
  }
  
  cancelDelete(category: Category) {
    category.remove = false;
  }

  createCategory(){
    console.log(this.formEditCategory);
    this.createCategoryState = 'loading';
    this.categoryService.create(this.formEditCategory.value as CategoryBody).subscribe({
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


  abrirConfirmacion(marcaId: number, nuevoEstado: boolean): void {
    this.mostrarModal = true;
    this.confirmacionId = marcaId;
    this.nuevoEstadoConfirmacion = nuevoEstado;
    this.mensajeConfirmacion = nuevoEstado 
      ? '¿Estás seguro de activar esta marca?' 
      : '¿Estás seguro de desactivar esta marca?';
  }

  cerrarConfirmacion(): void {
    this.mostrarModal = false;
    this.confirmacionId = null;
  }

  cambiarEstado(marcaId: number | null, nuevoEstado: boolean): void {
    if (marcaId === null) return;
    this.categoryService.cambiarEstado(marcaId, nuevoEstado).subscribe(
      () => {
        const marca = this.categorys.find(m => m.id === marcaId);
        if (marca) {
          marca.estado = nuevoEstado;
        }
        this.cerrarConfirmacion();
      },
      (error) => {
        console.error("Error al cambiar el estado:", error);
        this.cerrarConfirmacion();
      }
    );
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

  openEditModal(category: Category) {
    this.selectedCategoryId = category.id;
    this.formEditCategory.patchValue({
      nombre: category.nombre,
      descripcion: category.descripcion,
      estado: category.estado ? 'Activo' : 'Inactivo'
    });
    document.getElementById('modalEdit')?.classList.remove('hidden');
  }
  
  // Método para cerrar el modal de edición
  closeEditModal() {
    document.getElementById('modalEdit')?.classList.add('hidden');
    this.selectedCategoryId = null;
  }

  // implementacion actualizacion

  updateCategory() {
    if (this.selectedCategoryId) {
      this.updateCategoryState = 'loading';
      const updatedCategory: CategoryBody = {
        nombre: this.formEditCategory.value.nombre,
        descripcion: this.formEditCategory.value.descripcion
      };
      
      this.categoryService.update(this.selectedCategoryId, updatedCategory).subscribe({
        next: (data) => {
          this.updateCategoryState = 'done';
          this.closeEditModal();
          this.showConfirmationModal(); // Mostrar confirmación de éxito
        },
        error: () => {
          this.updateCategoryState = 'error';
          alert("Error al actualizar la categoria");
        }
      });
    }
  }

  // Método para mostrar el modal de confirmación
  showConfirmationModal() {
    const confirmModal = document.getElementById('confirm-clear-modal');
    confirmModal?.classList.remove('hidden');
  }
  
  // Método para ocultar el modal de confirmación y navegar a la lista de marcas
  hideConfirmationModal() {
    const confirmModal = document.getElementById('confirm-clear-modal');
    confirmModal?.classList.add('hidden');
    this.router.navigate(['administracion/gestion/productos/categorias']); // Redirige a la lista de marcas
  }
}