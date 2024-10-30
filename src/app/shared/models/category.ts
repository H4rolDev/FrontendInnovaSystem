export interface Category {
    id: number,
    name: string,
    description: string,
    state: boolean,
    remove?: boolean,
 }
 
 export interface CategoryBody {
    name: string,
    description: string,
 }
 