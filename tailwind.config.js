/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/app.component.html",
    "./src/app/catalogo/carousel-catalogo/carousel-catalogo.component.html",
    "./src/app/catalogo/footer-catalogo/footer-catalogo.component.html",
    "./src/app/catalogo/nav-catalogo/nav-catalogo.component.html",
    "./src/app/catalogo/main-catalogo/main-catalogo.component.html",
    "./src/app/catalogo/categories/computadora/computadora.component.html",
    "./src/app/catalogo/car-shopping/car-shopping.component.html",
    "./src/app/administracion/panel-principal/panel-principal.component.html",
    "./src/app/administracion/inventarioProductos/create-productos/create-productos.component.html",
    "./src/app/administracion/auth/login/login.component.html",
    "./src/app/administracion/auth/register/register.component.html"
  ],
  
  theme: {
    extend: {
      colors: {
        primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a","950":"#172554"}
      }
    },
    fontFamily: {
      'body': [
        'Inter', 
        'ui-sans-serif', 
        'system-ui', 
        '-apple-system', 
        'system-ui', 
        'Segoe UI', 
        'Roboto', 
        'Helvetica Neue', 
        'Arial', 
        'Noto Sans', 
        'sans-serif', 
        'Apple Color Emoji', 
        'Segoe UI Emoji', 
        'Segoe UI Symbol', 
        'Noto Color Emoji'
      ],
      'sans': [
        'Inter', 
        'ui-sans-serif', 
        'system-ui', 
        '-apple-system', 
        'system-ui', 
        'Segoe UI', 
        'Roboto', 
        'Helvetica Neue', 
        'Arial', 
        'Noto Sans', 
        'sans-serif', 
        'Apple Color Emoji', 
        'Segoe UI Emoji', 
        'Segoe UI Symbol', 
        'Noto Color Emoji'
      ]
    }
  },
  plugins: [],
}

