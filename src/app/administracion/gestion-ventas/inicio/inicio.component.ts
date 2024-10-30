import { CommonModule, NgIf } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Profile } from 'src/app/shared/models/profile';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  standalone: true,
  imports: [NgIf, RouterOutlet, CommonModule]
})
export class InicioComponent implements OnInit, AfterViewInit {
  menuOption: string = ''; // Inicializa con un valor vacío

  onOption(option: string) {
    this.menuOption = option; // Actualiza la opción seleccionada
  }

  dropdownOpen = false;
  profile?: Profile;
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) { }
  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (value) => this.profile = value,
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authService.logout();
  }

  /* Propiedades de la barra lateral ******************************** */
  sidebar!: HTMLElement | null;
  menuBtn!: HTMLElement | null;
  closeBtn!: HTMLElement | null;
  overlay!: HTMLElement | null;
  isSidebarActive: boolean = false;

  // Se ejecuta después de que la vista y el DOM hayan sido completamente inicializados
  ngAfterViewInit(): void {
    this.sidebar = document.getElementById("sidebar");
    this.menuBtn = document.getElementById("menu-btn");
    this.closeBtn = document.getElementById("close-btn");
    this.overlay = document.getElementById("overlay");

    this.initializeEventListeners(); // Configurar eventos para la barra lateral
    this.validateForm(); // Llamar a la función de validación del formulario al iniciar
  }

  initializeEventListeners(): void {
    if (this.menuBtn) {
      this.menuBtn.addEventListener("click", this.openSidebar.bind(this));
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", this.closeSidebar.bind(this));
    }

    if (this.overlay) {
      this.overlay.addEventListener("click", this.closeSidebar.bind(this));
    }

    document.addEventListener("click", (event) => {
      if (this.sidebar && !this.sidebar.contains(event.target as Node) && !this.menuBtn?.contains(event.target as Node)) {
        this.closeSidebar();
      }
    });
  }

  openSidebar(): void {
    if (this.sidebar && this.overlay) {
      this.sidebar.classList.add("show");
      this.overlay.style.display = "block";
      document.body.style.overflow = 'hidden';
      this.isSidebarActive = true;
    }
  }

  closeSidebar(): void {
    if (this.sidebar && this.overlay) {
      this.sidebar.classList.remove("show");
      this.overlay.style.display = "none";
      document.body.style.overflow = '';
      this.isSidebarActive = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (this.sidebar && this.overlay) {
      if (window.innerWidth >= 768) {
        this.closeSidebar();
      }
    }
  }

  /* Validación de los campos ******************************** */
  validateForm(): void {
    const form = document.getElementById('product-form') as HTMLFormElement;
    const errorMessage = document.getElementById('error-message') as HTMLElement;
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    const imagePreview = document.getElementById('image-preview') as HTMLElement;

    // Validación del formulario al enviarlo
    if (form) {
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

    // Manejo del cambio en el input de archivos
    if (fileInput) {
      fileInput.addEventListener('change', (event: Event) => {
        const files = (event.target as HTMLInputElement).files;
        console.log('Archivos seleccionados:', files); // Log para verificar archivos seleccionados
        imagePreview.innerHTML = ''; // Limpiar vista previa anterior

        if (files) {
          Array.from(files).forEach(file => {
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
              console.log('Cargando archivo:', e.target?.result); // Log para verificar el archivo cargado

              const imageContainer = document.createElement('div');
              imageContainer.className = 'relative inline-block m-2';

              const img = document.createElement('img');
              img.src = e.target?.result as string;
              img.className = 'h-32 w-32 object-cover rounded-md border border-gray-300';

              const deleteButton = document.createElement('button');
              deleteButton.textContent = 'X';
              deleteButton.className = 'absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs';
              deleteButton.onclick = () => imageContainer.remove(); // Eliminar la imagen al hacer clic

              imageContainer.append(img, deleteButton);
              imagePreview.appendChild(imageContainer); // Añadir el contenedor de imagen a la vista previa
            };

            reader.readAsDataURL(file); // Leer el archivo como URL de datos
          });
        }
      });
    }
  }
}
