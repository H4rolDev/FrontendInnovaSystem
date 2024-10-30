import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgClass } from '@angular/common';

interface Contact {
  name: string;
  email: string;
  // Agrega más propiedades según tu necesidad
}

interface Bestseller {
  productName: string;
  sales: number;
  // Agrega más propiedades según tu necesidad
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [NgFor, NgClass]
})
export class DashboardComponent implements OnInit {
  contacts: Contact[] = []; // Lista de contactos para la plantilla
  bestsellers: Bestseller[] = []; // Lista de productos más vendidos para la plantilla

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.sidebar = document.getElementById("sidebar");

    // Inicializar datos de ejemplo o cargar datos reales aquí
    this.contacts = [
      { name: 'Juan Pérez', email: 'juan@example.com' },
      { name: 'María García', email: 'maria@example.com' }
      // Agrega más contactos según necesites
    ];

    this.bestsellers = [
      { productName: 'Producto A', sales: 100 },
      { productName: 'Producto B', sales: 80 }
      // Agrega más productos más vendidos según necesites
    ];
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  sidebar!: HTMLElement | null;
}
