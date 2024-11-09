import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Trabajador, TrabajadorBody } from 'src/app/shared/models/empleado';
import { EmployeeService } from 'src/app/shared/services/employee.service';
import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { Puesto } from 'src/app/shared/models/puestos';
import { PuestoService } from 'src/app/shared/services/puesto.service';

registerLocaleData(localeEsPe, 'es-PE');

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css'],
  standalone: true,
  imports: [NgIf, NgClass, FormsModule, NgFor, CurrencyPipe, ReactiveFormsModule]
})
export class EmpleadosComponent implements OnInit {
  isModalOpen = false; 
  selectedTrabajador: Trabajador | null = null; 

  mostrarModal = false;
  mensajeConfirmacion = '';
  confirmacionId: number | null = null;
  nuevoEstadoConfirmacion: boolean = false;
  selectedTrabajadorId: number | null = null; // ID de la marca seleccionada para editar
  updateTrabajadorState = 'idle';

  cargaDatos: 'none' | 'loading' | 'done' | 'error' = "none";
  createTrabajadorState: 'none' | 'loading' | 'done' | 'error' = "none";
  showFormTrabajador: 'none' | 'edit' | 'add' = 'none';
  trabajadores: Trabajador[] = [];
  puestos: Puesto[] = [];

  modalEdit!: HTMLElement | null;
  confirmClearModal!: HTMLElement | null;
  btnCloseEdit!: HTMLElement | null;
  btnCancelEdit!: HTMLElement | null;
  btnSaveEdit!: HTMLElement | null;
  btnConfirmYes!: HTMLButtonElement | null;
  btnConfirmNo!: HTMLButtonElement | null;
  formEditTrabajador!: FormGroup;
  constructor(
    private router: Router,
    private trabajadorService: EmployeeService,
    private puestoService: PuestoService,
    private fb: FormBuilder
  ) {
    this.formEditTrabajador = this.fb.group({
      nombres: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      salario: ['', [Validators.required, Validators.min(0)]],
      nombrePuesto: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Aplicando las APIs
    this.loadTrabajadores();
    this.loadPuestos();

    
    

    // Asigna los elementos del DOM
    this.assignDOMElements();
    this.initializeEventListeners();
  }

  loadTrabajadores(){
    this.cargaDatos = 'loading';
    this.trabajadorService.obtenerTrabajadoresConPuesto().subscribe({
      next: (data) => {
        this.cargaDatos = 'done',
        this.trabajadores = data;
      },
      error: (_) => {
        this.cargaDatos = 'error';
      }
    });
  }

  // Método para cargar los puestos desde la API
  loadPuestos() {
    this.puestoService.list().subscribe((data) => {
      this.puestos = data;
    });
  }

  addTrabajador(){
    this.showFormTrabajador = "add";
    this.createTrabajadorState = 'none';
  }

  removeTrabajador(trabajador: Trabajador) {
    trabajador.remove = true;
  }

  // Función para confirmar la eliminación
  confirmDelete(trabjadorId: number) {
    // Buscar la marca en el arreglo usando el id
    const trabajador = this.trabajadores.find(b => b.id === trabjadorId);
    if (trabajador) {
      this.trabajadorService.remove(trabjadorId).subscribe({
        next: (res) => {
          // Eliminar la marca del arreglo
          this.trabajadores = this.trabajadores.filter(b => b.id !== trabjadorId);
          trabajador.remove = false;  // Cerrar el modal
        },
        error: (err) => {
          console.error('Error al eliminar el trabajador', err);
          trabajador.remove = false;  // Cerrar el modal en caso de error
        }
      });
    }
  }
  
  cancelDelete(trabajador: Trabajador) {
    trabajador.remove = false;
  }

  createTrabajador(){
    console.log(this.formEditTrabajador);
    this.createTrabajadorState = 'loading';
    this.trabajadorService.create(this.formEditTrabajador.value as TrabajadorBody).subscribe({
      next: (data) => {
        this.createTrabajadorState = 'done';
        // this.listAll();
        this.trabajadores.push(data);
      },
      error: (err) => {
        this.createTrabajadorState = 'error';
      }
    });
  }


  abrirConfirmacion(trabjadorId: number, nuevoEstado: boolean): void {
    this.mostrarModal = true;
    this.confirmacionId = trabjadorId;
    this.nuevoEstadoConfirmacion = nuevoEstado;
    this.mensajeConfirmacion = nuevoEstado 
      ? '¿Estás seguro de habilitar a este trabajador?' 
      : '¿Estás seguro de desabilitar a este trabajador?';
  }

  cerrarConfirmacion(): void {
    this.mostrarModal = false;
    this.confirmacionId = null;
  }

  cambiarEstado(trabjadorId: number | null, nuevoEstado: boolean): void {
    if (trabjadorId === null) return;
    this.trabajadorService.cambiarEstado(trabjadorId, nuevoEstado).subscribe(
      () => {
        const trabajador = this.trabajadores.find(m => m.id === trabjadorId);
        if (trabajador) {
          trabajador.estado = nuevoEstado;
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

  openEditModal(trabajador: Trabajador) {
    this.selectedTrabajadorId = trabajador.id;
    this.formEditTrabajador.patchValue({
      nombre: trabajador.nombres,
      apellidoPaterno: trabajador.apellidoPaterno,
      apellidoMaterno: trabajador.apellidoMaterno,
      telefono: trabajador.telefono,
      salario: trabajador.salario,
      puesto: trabajador.nombrePuesto,
      estado: trabajador.estado ? 'Activo' : 'Inactivo'
    });
    document.getElementById('modalEdit')?.classList.remove('hidden');
  }
  
  // Método para cerrar el modal de edición
  closeEditModal() {
    document.getElementById('modalEdit')?.classList.add('hidden');
    this.selectedTrabajadorId = null;
  }

  // implementacion actualizacion
  updateTrabajador() {
    if (this.selectedTrabajadorId) {
      this.updateTrabajadorState = 'loading';
      const updatedTrabajador: TrabajadorBody = {
        nombres: this.formEditTrabajador.value.nombre,
        apellidoPaterno: this.formEditTrabajador.value.apellidoPaterno,
        apellidoMaterno: this.formEditTrabajador.value.apellidoMaterno,
        telefono: this.formEditTrabajador.value.telefono,
        salario: this.formEditTrabajador.value.salario,
        nombrePuesto: this.formEditTrabajador.value.puesto
      };
      
      this.trabajadorService.update(this.selectedTrabajadorId, updatedTrabajador).subscribe({
        next: (data) => {
          this.updateTrabajadorState = 'done';
          this.closeEditModal();
        },
        error: () => {
          this.updateTrabajadorState = 'error';
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