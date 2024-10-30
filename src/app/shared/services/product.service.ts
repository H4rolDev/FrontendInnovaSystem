import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductBody, Producto } from '../models/producto';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  list(): Observable<Producto[]> {
    return this.http.get<Producto[]>(
      `${environment.backendBaseUrl}/api/v1/admin/producto`);
  }
  
  remove(productId: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.backendBaseUrl}/api/v1/admin/producto/${productId}`);
  }

  create(producto: ProductBody): Observable<Producto> {
    const url = `${environment.backendBaseUrl}/api/v1/admin/producto`;
    return this.http.post<Producto>(url, producto);
  }

  update(productId: number, producto: ProductBody): Observable<Producto> {
    const url = `${environment.backendBaseUrl}/api/v1/admin/producto/${productId}`;
    return this.http.put<Producto>(url, producto);
  }
}
