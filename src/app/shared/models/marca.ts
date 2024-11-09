export interface Marca {
   id: number,
   nombre: string,
   descripcion: string,
   estado: boolean,
   remove?: boolean,
 }
 
 export interface MarcaBody {
   nombre: string,
   descripcion: string,
   estado: boolean
 }
 