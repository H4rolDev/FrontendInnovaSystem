import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterBody } from '../models/register-body';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CustomResponse } from '../models/custom-response';
import { environment } from 'src/environments/environment.development';
import { LoginResponse } from '../models/login-response';
import { LoginRequest } from '../models/login-request';
import { Profile } from '../models/profile';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private profile?: Profile;
  private exp: Date = new Date();
  
  private timmer?: any;
  private profileSubject: BehaviorSubject<Profile | undefined>;

  constructor(private http: HttpClient,private router: Router,) {
    const profileData = localStorage.getItem('profile');
    if (profileData) {
      this.profile = JSON.parse(profileData);
    } 
    this.profileSubject = new BehaviorSubject(this.profile);
  }

  getProfileX(): Profile | undefined {
    return this.profile
  };
  getProfile(): Observable<Profile| undefined> {
    return this.profileSubject.asObservable();
  }
  setProfile(profile: Profile | undefined) {
    this.profile = profile;
    this.profileSubject.next(this.profile);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    const url = `${environment.backendBaseUrl}/api/v1/auth/login`;
    return this.http.post<LoginResponse>(url, data).pipe(
      tap( (response) => this.processLogin(response)
      ) 
    );
  }

  logout() {
    localStorage.clear();
    this.profile = undefined;
    this.profileSubject.next(undefined);
    this.router.navigateByUrl('/auth/login');
  }

  register(body: RegisterBody): Observable<CustomResponse> {
    const url = `${environment.backendBaseUrl}/api/v1/auth/register`;
    return this.http.post<CustomResponse>(url, body);
  }

  private processLogin(res: LoginResponse) {
    this.profile = res.profile;
    this.profileSubject.next(this.profile);
    localStorage.setItem('jwt', res.token);
    localStorage.setItem('profile', JSON.stringify(res.profile));
    // trabajar con el JWT
    const decoded = jwtDecode(res.token);
    if (decoded && decoded.exp) {
      this.exp = new Date(decoded.exp * 1000);
      clearInterval(this.timmer);
      this.timmer = setInterval(()=> {
        const now = new Date();
        console.log(now, this.exp);
        console.log('TIEMPO DE SESION', now, this.exp);
        if (now >= this.exp) {
          this.logout();
          clearInterval(this.timmer);
          Swal.fire({
            title: 'Se acabo el tiempo de sus sesion!',
            text: 'para seguir usando el sistema inicie sesion nuevamente.',
            icon: 'error', // o 'error', 'warning', 'info', 'question'
            confirmButtonText: 'Aceptar'
          });
        }
      }, 5000);
    }
  }
}
