import { Injectable } from '@angular/core';
import { MarcaBody, Marca } from '../models/marca';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http: HttpClient) { }
  
  list(): Observable<Marca[]> {
    return this.http.get<Marca[]>(
      `${environment.backendBaseUrl}/api/v1/admin/marca`);
  }
  
  remove(marcaId: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.backendBaseUrl}/api/v1/admin/marca/${marcaId}`);
  }

  create(body: MarcaBody): Observable<Marca> {
    const url = `${environment.backendBaseUrl}/api/v1/admin/marca`;
    return this.http.post<Marca>(url, body);
  }

  update(marcaId: number, body: MarcaBody): Observable<Marca> {
    const url = `${environment.backendBaseUrl}/api/v1/admin/marca/${marcaId}`;
    return this.http.put<Marca>(url, body);
  }

  cambiarEstado(marcaId: number, nuevoEstado: boolean): Observable<Marca> {
    const url = `${environment.backendBaseUrl}/api/v1/admin/marca/${marcaId}/cambiar-estado`;
    return this.http.put<Marca>(url, nuevoEstado);
  }
}
