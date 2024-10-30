import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { StateEnum } from 'src/app/shared/models/state.enum';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import Swal from 'sweetalert2';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, RouterLinkActive, RouterLink]
})
export class LoginComponent implements OnInit {
  stateEnum = StateEnum;
  loginState: StateEnum = StateEnum.none;
  loginForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {

  }

  login() {
    this.loginState = StateEnum.loading;
    this.authService.login(this.loginForm.value).subscribe({
      next: (data) => {
        this.loginState = StateEnum.done;
        Swal.fire({
          title: 'Inicio de sesión correcta!',
          text: 'Sera dirigido al panel de usuario.',
          icon: 'success', // o 'error', 'warning', 'info', 'question'
          confirmButtonText: 'Aceptar'
        }).then(
          (_) => {
            this.router.navigateByUrl('/administracion/inicio');
          }
        );
      },
      error: (err) => {
        this.loginState = StateEnum.error;
        Swal.fire({
          title: 'Inicio de sesión incorrecto!',
          text: 'Sus credenciales no se validaron, intentelo de nuevo.',
          icon: 'error', // o 'error', 'warning', 'info', 'question'
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
  irALogin() {
    this.router.navigate([{ outlets: { auth: ['auth/login'] } }]);
  }
}

