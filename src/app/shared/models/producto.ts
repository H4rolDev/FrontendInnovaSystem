export interface Producto {
    id: number;
    categoriaId: number;
    marcaId: number;
    nombre: string;
    imagen: string;
    descripcion: string;
    modelo: string;
    precioVenta: number; 
    utilidadPrecioVenta: number; 
    utilidadPorcentaje: string; 
    stock: number;
    garantia: number;
    estado: boolean;
    remove?: boolean,
}

export interface ProductBody{
    categoriaId: number;
    marcaId: number;
    nombre: string;
    imagen: string;
    descripcion: string;
    modelo: string;
    precioVenta: number; 
    utilidadPrecioVenta: number; 
    utilidadPorcentaje: number; 
    stock: number;
    garantia: number;
}