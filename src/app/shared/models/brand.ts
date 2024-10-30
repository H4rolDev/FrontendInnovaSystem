export interface Brand {
    id: number,
    name: string,
    description: string,
    state: boolean,
    remove?: boolean,
 }
 
 export interface BrandBody {
    name: string,
    description: string,
 }
 