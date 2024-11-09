export interface Trabajador {
   id: number;
   nombres: string;
   apellidoPaterno: string;
   apellidoMaterno: string;
   telefono: string;
   salario: number;
   nombrePuesto: string;
   estado: boolean;
   remove?: boolean
 }

 export interface TrabajadorBody {
   nombres: string;
   apellidoPaterno: string;
   apellidoMaterno: string;
   telefono: string;
   salario: number;
   nombrePuesto: string;
 }