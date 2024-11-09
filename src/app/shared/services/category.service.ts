import { Injectable } from '@angular/core';
import { Category, CategoryBody } from '../models/category';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }
  
  list(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${environment.backendBaseUrl}/api/v1/admin/categoria`);
  }
  
  remove(categoriaId: number): Observable<Category> {
    return this.http.delete<any>(
      `${environment.backendBaseUrl}/api/v1/admin/categoria/${categoriaId}`);
  }

  create(body: CategoryBody): Observable<Category> {
    const url = `${environment.backendBaseUrl}/api/v1/admin/categoria`;
    return this.http.post<Category>(url, body);
  }

  update(categoriaId: number, body: CategoryBody): Observable<Category> {
    const url = `${environment.backendBaseUrl}/api/v1/admin/categoria/${categoriaId}`;
    return this.http.put<Category>(url, body);
  }

  cambiarEstado(categoriaId: number, nuevoEstado: boolean): Observable<Category> {
    const url = `${environment.backendBaseUrl}/api/v1/admin/categoria/${categoriaId}/cambiar-estado`;
    return this.http.put<Category>(url, nuevoEstado);
  }
}
