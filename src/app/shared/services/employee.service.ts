import { Injectable } from '@angular/core';
import { Trabajador, TrabajadorBody } from '../models/empleado';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }
  
  list(): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(
      `${environment.backendBaseUrl}/api/v1/admin/trabajador`);
  }
  
  remove(trabjadorId: number): Observable<Trabajador> {
    return this.http.delete<any>(
      `${environment.backendBaseUrl}/api/v1/admin/trabajador/${trabjadorId}`);
  }

  create(body: TrabajadorBody): Observable<Trabajador> {
    const url = `${environment.backendBaseUrl}/api/v1/admin/trabajador`;
    return this.http.post<Trabajador>(url, body);
  }

  update(trabjadorId: number, body: TrabajadorBody): Observable<Trabajador> {
    const url = `${environment.backendBaseUrl}/api/v1/admin/trabajador/${trabjadorId}`;
    return this.http.put<Trabajador>(url, body);
  }

  cambiarEstado(trabjadorId: number, nuevoEstado: boolean): Observable<Trabajador> {
    const url = `${environment.backendBaseUrl}/api/v1/admin/trabajador/${trabjadorId}/cambiar-estado`;
    return this.http.put<Trabajador>(url, nuevoEstado);
  }

  obtenerTrabajadoresConPuesto(): Observable<Trabajador[]> {
    const url = `${environment.backendBaseUrl}/api/v1/admin/trabajador/ObtenerTrabajadoresConPuesto`;  // Ajusta el endpoint según tu backend
    return this.http.get<Trabajador[]>(url);
  }
}
