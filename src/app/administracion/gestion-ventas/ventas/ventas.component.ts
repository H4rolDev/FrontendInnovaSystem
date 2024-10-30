import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
  standalone: true,
  imports: [NgIf, NgClass]
})

export class VentasComponent implements OnInit {
  constructor(private router: Router) { }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  // Propiedades: Definimos las propiedades necesarias para interactuar con los elementos HTML.
  // Propiedades de la barra lateral (sidebar)
  sidebar!: HTMLElement | null;
  menuBtn!: HTMLElement | null;
  closeBtn!: HTMLElement | null;
  overlay!: HTMLElement | null;

  ngOnInit(): void {
    this.sidebar = document.getElementById("sidebar");
    this.closeBtn = document.getElementById("close-btn");
    this.overlay = document.getElementById("overlay");

    // Inicializa los eventos del modal de confirmación
    this.initializeConfirmButtons();
  }

  // openConfirmClearModal: Muestra el modal de confirmación.
  openConfirmClearModal(): void {
    const confirmClearModal = document.getElementById("confirm-clear-modal");
    if (confirmClearModal) {
      confirmClearModal.classList.remove("hidden"); // Muestra el modal de confirmación
    }
  }

  // closeConfirmClearModal: Oculta el modal de confirmación.
  closeConfirmClearModal(): void {
    const confirmClearModal = document.getElementById("confirm-clear-modal");
    if (confirmClearModal) {
      confirmClearModal.classList.add("hidden"); // Oculta el modal
    }
  }

  // confirmClear: Realiza la acción de confirmación.
  confirmClear(): void {
    // Lógica para la confirmación
    this.closeConfirmClearModal();
    console.log('Acción confirmada.');
  }

  // initializeConfirmButtons: Inicializa los eventos de los botones del modal de confirmación.
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