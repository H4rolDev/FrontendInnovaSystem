import { Rol } from "./rol"

export interface Profile {
    id: number
    names: string
    lastName: string
    email: string
    rol: Rol
  }