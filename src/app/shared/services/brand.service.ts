import { Injectable } from '@angular/core';
import { Brand, BrandBody } from '../models/brand';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http: HttpClient) { }
  
  list(): Observable<Brand[]> {
    return this.http.get<Brand[]>(
      `${environment.backendBaseUrl}/api/v1/admin/marca`);
  }
  
  remove(brandId: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.backendBaseUrl}/api/v1/admin/marca/${brandId}`);
  }

  create(body: BrandBody): Observable<Brand> {
    const url = `${environment.backendBaseUrl}/api/v1/admin/marca`;
    return this.http.post<Brand>(url, body);
  }

  update(brandId: number, body: BrandBody): Observable<Brand> {
    const url = `${environment.backendBaseUrl}/api/v1/admin/marca/${brandId}`;
    return this.http.put<Brand>(url, body);
  }
}
