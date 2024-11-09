export interface Category {
    id: number,
    nombre: string,
    descripcion: string,
    estado: boolean,
    remove?: boolean,
 }
 
 export interface CategoryBody {
    nombre: string,
    descripcion: string,
 }
 