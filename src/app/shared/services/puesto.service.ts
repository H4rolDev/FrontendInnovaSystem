import { Injectable } from '@angular/core';
import { Puesto, PuestoBody } from '../models/puestos';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PuestoService {

  constructor(private http: HttpClient) { }
  
  list(): Observable<Puesto[]> {
    return this.http.get<Puesto[]>(
      `${environment.backendBaseUrl}/api/v1/admin/cargo`);
  }
  
  remove(puestoId: number): Observable<Puesto> {
    return this.http.delete<any>(
      `${environment.backendBaseUrl}/api/v1/admin/cargo/${puestoId}`);
  }

  create(body: PuestoBody): Observable<Puesto> {
    const url = `${environment.backendBaseUrl}/api/v1/admin/cargo`;
    return this.http.post<Puesto>(url, body);
  }

  update(puestoId: number, body: PuestoBody): Observable<Puesto> {
    const url = `${environment.backendBaseUrl}/api/v1/admin/cargo/${puestoId}`;
    return this.http.put<Puesto>(url, body);
  }

  cambiarEstado(puestoId: number, nuevoEstado: boolean): Observable<Puesto> {
    const url = `${environment.backendBaseUrl}/api/v1/admin/cargo/${puestoId}/cambiar-estado`;
    return this.http.put<Puesto>(url, nuevoEstado);
  }
}
