import { NgIf, NgClass, NgFor, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Puesto, PuestoBody } from 'src/app/shared/models/puestos';
import { PuestoService } from 'src/app/shared/services/puesto.service';
import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';

registerLocaleData(localeEsPe, 'es-PE');

@Component({
  selector: 'app-puestos',
  templateUrl: './puestos.component.html',
  styleUrls: ['./puestos.component.css'],
  standalone: true,
  imports: [NgIf, NgClass, FormsModule, NgFor, CurrencyPipe, ReactiveFormsModule]
})

export class PuestosComponent implements OnInit {
  isModalOpen = false; 
  selectedPuesto: Puesto | null = null; 

  mostrarModal = false;
  mensajeConfirmacion = '';
  confirmacionId: number | null = null;
  nuevoEstadoConfirmacion: boolean = false;
  selectedPuestoId: number | null = null; // ID de la marca seleccionada para editar
  updatePuestoState = 'idle';


  cargaDatos: 'none' | 'loading' | 'done' | 'error' = "none";
  createPuestoState: 'none' | 'loading' | 'done' | 'error' = "none";
  showFormPuesto: 'none' | 'edit' | 'add' = 'none';
  puestos: Puesto[] = [];
  modalEdit!: HTMLElement | null;
  confirmClearModal!: HTMLElement | null;
  btnCloseEdit!: HTMLElement | null;
  btnCancelEdit!: HTMLElement | null;
  btnSaveEdit!: HTMLElement | null;
  btnConfirmYes!: HTMLButtonElement | null;
  btnConfirmNo!: HTMLButtonElement | null;
  formEditPuesto: FormGroup;
  constructor(
    private router: Router,
    private puestoService: PuestoService,
    private fb: FormBuilder
  ) {
    this.formEditPuesto = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      salarioBase:['', Validators.required],
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

  listAll(){
    this.cargaDatos = 'loading';
    this.puestoService.list().subscribe({
      next: (data) => {
        this.cargaDatos = 'done',
        this.puestos = data;
      },
      error: (_) => {
        this.cargaDatos = 'error';
      }
    });
  }

  addPuesto(){
    this.showFormPuesto = "add";
    this.createPuestoState = 'none';
  }

  removePuesto(puesto: Puesto) {
    puesto.remove = true;
  }

  // Función para confirmar la eliminación
  confirmDelete(puestoId: number) {
    // Buscar la marca en el arreglo usando el id
    const puesto = this.puestos.find(b => b.id === puestoId);
    if (puesto) {
      this.puestoService.remove(puestoId).subscribe({
        next: (res) => {
          // Eliminar la marca del arreglo
          this.puestos = this.puestos.filter(b => b.id !== puestoId);
          puesto.remove = false;  // Cerrar el modal
        },
        error: (err) => {
          console.error('Error al eliminar el Cargo', err);
          puesto.remove = false;  // Cerrar el modal en caso de error
        }
      });
    }
  }
  
  cancelDelete(puestos: Puesto) {
    puestos.remove = false;
  }

  createPuesto(){
    console.log(this.formEditPuesto);
    this.createPuestoState = 'loading';
    this.puestoService.create(this.formEditPuesto.value as PuestoBody).subscribe({
      next: (data) => {
        this.createPuestoState = 'done';
        // this.listAll();
        this.puestos.push(data);
      },
      error: (err) => {
        this.createPuestoState = 'error';
      }
    });
  }


  abrirConfirmacion(puestoId: number, nuevoEstado: boolean): void {
    this.mostrarModal = true;
    this.confirmacionId = puestoId;
    this.nuevoEstadoConfirmacion = nuevoEstado;
    this.mensajeConfirmacion = nuevoEstado 
      ? '¿Estás seguro de activar este Puesto?' 
      : '¿Estás seguro de desactivar esta Puesto?';
  }

  cerrarConfirmacion(): void {
    this.mostrarModal = false;
    this.confirmacionId = null;
  }

  cambiarEstado(puestoId: number | null, nuevoEstado: boolean): void {
    if (puestoId === null) return;
    this.puestoService.cambiarEstado(puestoId, nuevoEstado).subscribe(
      () => {
        const marca = this.puestos.find(m => m.id === puestoId);
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




  openEditModal(puestos: Puesto) {
    this.selectedPuestoId = puestos.id;
    this.formEditPuesto.patchValue({
      nombre: puestos.nombre,
      descripcion: puestos.descripcion,
      salarioBase: puestos.salarioBase,
      estado: puestos.estado ? 'Activo' : 'Inactivo'
    });
    document.getElementById('modalEdit')?.classList.remove('hidden');
  }
  
  // Método para cerrar el modal de edición
  closeEditModal() {
    document.getElementById('modalEdit')?.classList.add('hidden');
    this.selectedPuestoId = null;
  }

  // implementacion actualizacion

  updatePuesto() {
    if (this.selectedPuestoId) {
      this.updatePuestoState = 'loading';
      const updatedPuesto: PuestoBody = {
        nombre: this.formEditPuesto.value.nombre,
        descripcion: this.formEditPuesto.value.descripcion,
        salarioBase: this.formEditPuesto.value.salarioBase,
      };
      
      this.puestoService.update(this.selectedPuestoId, updatedPuesto).subscribe({
        next: (data) => {
          this.updatePuestoState = 'done';
          this.closeEditModal();
          this.showConfirmationModal(); // Mostrar confirmación de éxito
        },
        error: () => {
          this.updatePuestoState = 'error';
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
    this.router.navigate(['administracion/gestion/usuarios/puestos']); // Redirige a la lista de marcas
  }
}
