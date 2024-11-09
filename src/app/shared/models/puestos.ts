export interface Puesto {
    id: number,
    nombre: string,
    descripcion: string,
    salarioBase: number,
    estado: boolean,
    remove?: boolean,
 }
 
 export interface PuestoBody {
    nombre: string,
    descripcion: string,
    salarioBase: number,
 }
 