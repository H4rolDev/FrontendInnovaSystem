import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StateEnum } from 'src/app/shared/models/state.enum';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import Swal from 'sweetalert2';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgClass, NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgClass, NgIf, NgFor, RouterLinkActive, RouterLink]
})
export class RegisterComponent implements OnInit {
  stateEnum = StateEnum;
  registerState:StateEnum = StateEnum.none;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      tipo_documento: ['', [Validators.required]],
      numero_documento: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Solo números
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      rePassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }
  documentTypes = [
    { value: 'dni', label: 'DNI', length: 8 },
    { value: 'ruc', label: 'RUC', length: 11 },
    { value: 'carnet', label: 'Carné de Extranjería', length: 12 }
  ];
  ngOnInit(): void {
    this.registerForm.get('documentType')?.valueChanges.subscribe(value => {
      this.updateDocumentNumberValidators(value);
    });
  }

  updateDocumentNumberValidators(tipo_documento: string) {
    const numero_documentoControl = this.registerForm.get('numero_documento');
    const selectedType = this.documentTypes.find(type => type.value === tipo_documento);
    
    if (selectedType) {
      numero_documentoControl?.setValidators([
        Validators.required,
        Validators.pattern('^[0-9]*$'), // Solo números
        Validators.minLength(selectedType.length),
        Validators.maxLength(selectedType.length)
      ]);
    }
    
    numero_documentoControl?.updateValueAndValidity();
  }

  getRequiredLength() {
    const selectedType = this.registerForm.get('documentType')?.value;
    const documentType = this.documentTypes.find(type => type.value === selectedType);
    return documentType ? documentType.length : 0;
  }

  passwordValidator(control: any): { [key: string]: boolean } | null {
    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const isValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    return !isValid ? { 'weakPassword': true } : null;
  }

  // Método para validar si las contraseñas coinciden
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('rePassword')?.value ? null : { mismatch: true };
  }

  register() {
    this.registerState = StateEnum.loading;

    // Verifica si el formulario es válido
    if (this.registerForm.invalid) {
      console.error('Formulario inválido', this.registerForm.errors);
      this.registerState = StateEnum.error;
      return;
    }
    
    const registerData = this.registerForm.value;

    this.authService.register(this.registerForm.value).subscribe({
      next: (data) => {
        this.registerState = StateEnum.done;
        console.log(data);
        this.registerForm.reset();
        Swal.fire({
          title: 'Usuario registrado!',
          text: 'Su usuario se registro correctamente.',
          icon: 'success', // o 'error', 'warning', 'info', 'question'
          confirmButtonText: 'Aceptar'
        });
      },
      error: (err) => {
        console.error('Error en el registro', err);
        if (err.error && err.error.errors) {
          console.error('Detalles de errores de validación:', err.error.errors);
        }
        this.registerState = StateEnum.error;
      }
    });
  }
}
