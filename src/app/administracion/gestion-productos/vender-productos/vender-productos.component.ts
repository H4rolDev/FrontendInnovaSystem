import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vender-productos',
  templateUrl: './vender-productos.component.html',
  styleUrls: ['./vender-productos.component.css'],
  standalone: true,
  imports: [NgIf, NgClass, FormsModule]
})
export class VenderProductosComponent implements OnInit {

  constructor(private router: Router) { }

  // Propiedades para el modal de edición
  modalEdit!: HTMLElement | null;
  btnCloseEdit!: HTMLElement | null;
  btnCancelEdit!: HTMLElement | null;
  btnSaveEdit!: HTMLElement | null;

  // Propiedad para el modal de cancelación
  isCancelModalOpen: boolean = false;

  ngOnInit(): void {
    this.modalEdit = document.getElementById("modalEdit");
    this.btnCloseEdit = document.getElementById("btnCloseEdit");
    this.btnCancelEdit = document.getElementById("btnCancelEdit");
    this.btnSaveEdit = document.getElementById("btnSaveEdit");

    // Inicializa los eventos del modal de edición
    this.initializeEventListeners();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  // initializeEventListeners: Asigna eventos a los botones del modal de edición.
  initializeEventListeners(): void {
    if (this.modalEdit && this.btnCloseEdit && this.btnCancelEdit && this.btnSaveEdit) {
      this.btnCloseEdit.addEventListener("click", this.closeModalEdit.bind(this));
      document.querySelectorAll('.btnOpenModal').forEach(button => {
        button.addEventListener('click', this.openModalEdit.bind(this));
      });
    }
  }

  // Abre el modal de edición
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

  // Abre el modal de cancelación
  openCancelModal(): void {
    this.isCancelModalOpen = true;
  }

  // Cierra el modal de cancelación
  closeCancelModal(): void {
    this.isCancelModalOpen = false;
  }

  // Confirma la acción de cancelación
  confirmCancel(): void {
    this.isCancelModalOpen = false;
    console.log('Acción de cancelación confirmada');
    window.location.reload();
  }

  // Función para abrir el modal del carrito
  showCartConfirmationModal(): void {
    const modal = document.getElementById("cart-shop-modal") as HTMLElement;
    if (modal) {
      modal.classList.remove("hidden");
    }
  }

  // Función para cerrar el modal del carrito
  closeCartModal(): void {
    const modal = document.getElementById("cart-shop-modal") as HTMLElement;
    if (modal) {
      modal.classList.add("hidden");
    }
  }

  // Nueva función para manejar la acción del botón "Registrar la venta"
  handleRegisterSale(): void {
    this.closeCartModal();
    console.log('Redirigiendo a registrar la venta...');
  }

  // Función para desplegar el filtro de búsqueda de ventas
  isDropdownOpen: boolean = false;

  // Funcionalidad de método de pago
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectedTab: string = 'card';

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  validateForm(formId: string): boolean {
    alert('Formulario enviado con éxito!');
    return true;
  }
}
