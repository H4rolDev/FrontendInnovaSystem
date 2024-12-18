import { Routes } from "@angular/router";
import { LoginComponent } from "./administracion/auth/login/login.component";
import { RegisterComponent } from "./administracion/auth/register/register.component";
import { CategoriasComponent } from "./administracion/gestion-productos/categorias/categorias.component";
import { ListaProductosComponent } from "./administracion/gestion-productos/lista-productos/lista-productos.component";
import { MarcasComponent } from "./administracion/gestion-productos/marcas/marcas.component";
import { NuevaCategoriaComponent } from "./administracion/gestion-productos/nueva-categoria/nueva-categoria.component";
import { NuevaMarcaComponent } from "./administracion/gestion-productos/nueva-marca/nueva-marca.component";
import { NuevoProductoComponent } from "./administracion/gestion-productos/nuevo-producto/nuevo-producto.component";
import { VenderProductosComponent } from "./administracion/gestion-productos/vender-productos/vender-productos.component";
import { ClientesComponent } from "./administracion/gestion-usuarios/clientes/clientes.component";
import { EmpleadosComponent } from "./administracion/gestion-usuarios/empleados/empleados.component";
import { NuevoClienteComponent } from "./administracion/gestion-usuarios/nuevo-cliente/nuevo-cliente.component";
import { NuevoEmpleadoComponent } from "./administracion/gestion-usuarios/nuevo-empleado/nuevo-empleado.component";
import { NuevoPuestoComponent } from "./administracion/gestion-usuarios/nuevo-puesto/nuevo-puesto.component";
import { NuevoRolComponent } from "./administracion/gestion-usuarios/nuevo-rol/nuevo-rol.component";
import { NuevoUsuarioComponent } from "./administracion/gestion-usuarios/nuevo-usuario/nuevo-usuario.component";
import { PuestosComponent } from "./administracion/gestion-usuarios/puestos/puestos.component";
import { RolesComponent } from "./administracion/gestion-usuarios/roles/roles.component";
import { UsuariosComponent } from "./administracion/gestion-usuarios/usuarios/usuarios.component";
import { DashboardComponent } from "./administracion/gestion-ventas/dashboard/dashboard.component";
import { InicioComponent } from "./administracion/gestion-ventas/inicio/inicio.component";
import { VentasComponent } from "./administracion/gestion-ventas/ventas/ventas.component";
import { NuevoServicioComponent } from "./administracion/relaciones-proveedores/nuevo-servicio/nuevo-servicio.component";
import { ServicioTecnicoComponent } from "./administracion/relaciones-proveedores/servicio-tecnico/servicio-tecnico.component";
import { AppComponent } from "./app.component";

export const routes: Routes = [
    { path: '', component: InicioComponent},
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent },
    { path: 'administracion/gestion/producto/nuevo', component: NuevoProductoComponent },
    { path: 'administracion/gestion/producto/lista', component: ListaProductosComponent },
    { path: 'administracion/gestion/producto/vender', component: VenderProductosComponent },
    { path: 'administracion/gestion/usuarios/roles', component: RolesComponent },
    { path: 'administracion/gestion/usuarios/rol/nuevo', component: NuevoRolComponent },
    { path: 'administracion/gestion/usuarios', component: UsuariosComponent },
    { path: 'administracion/gestion/usuarios/nuevo', component: NuevoUsuarioComponent },
    { path: 'administracion/gestion/ventas/dashboard', component: DashboardComponent },
    { path: 'administracion/gestion/ventas', component: VentasComponent },
    { path: 'administracion/gestion/servicioTecnico', component: ServicioTecnicoComponent },
    { path: 'administracion/gestion/servicioTecnico/nuevo', component: NuevoServicioComponent },
    { path: 'administracion/gestion/usuarios/empleados', component: EmpleadosComponent },
    { path: 'administracion/gestion/usuarios/empleados/nuevo', component: NuevoEmpleadoComponent },
    { path: 'administracion/gestion/productos/categorias', component: CategoriasComponent },
    { path: 'administracion/gestion/productos/categorias/nuevo', component: NuevaCategoriaComponent },
    { path: 'administracion/gestion/productos/marcas', component: MarcasComponent },
    { path: 'administracion/gestion/productos/marcas/nuevo', component: NuevaMarcaComponent },
    { path: 'administracion/gestion/usuarios/puestos', component: PuestosComponent },
    { path: 'administracion/gestion/usuarios/puestos/nuevo', component: NuevoPuestoComponent },
    { path: 'administracion/gestion/usuarios/cliente/nuevo', component: NuevoClienteComponent },
    { path: 'administracion/gestion/usuarios/cliente', component: ClientesComponent },
    { path: '**', redirectTo: '/', pathMatch: 'full' },
];

