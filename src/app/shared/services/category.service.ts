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
  
  remove(brandId: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.backendBaseUrl}/api/v1/admin/categoria/${brandId}`);
  }

  create(body: CategoryBody): Observable<Category> {
    const url = `${environment.backendBaseUrl}/api/v1/admin/categoria`;
    return this.http.post<Category>(url, body);
  }
}
