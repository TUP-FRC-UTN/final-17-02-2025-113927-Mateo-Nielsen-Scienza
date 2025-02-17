import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6) 
      ]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      
      this.authService.login(username, password).subscribe({
        next: (user) => {
          if (user.role === 'admin') {
            this.router.navigate(['/admin/scores']);
          } else {
            this.router.navigate(['/game']);
          }
        },
        error: (error) => {
          if (error.message === 'El correo debe ser institucional') {
            this.error = 'El correo debe ser institucional (@tecnicatura.frc.utn.edu.ar)';
          } else if (error.message === 'La contraseña debe ser su número de legajo') {
            this.error = 'La contraseña debe ser su número de legajo';
          } else {
            this.error = 'Credenciales inválidas';
          }
        }
      });
    } else {
      this.validateAllFormFields();
    }
  }

  private validateAllFormFields() {
    Object.keys(this.loginForm.controls).forEach(field => {
      const control = this.loginForm.get(field);
      control?.markAsTouched();
    });
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    
    if (control?.hasError('required')) {
      return `El campo ${field} es requerido`;
    }
    
    if (field === 'username' && control?.hasError('minlength')) {
      return 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    
    if (field === 'password' && control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    
    return '';
  }
}
