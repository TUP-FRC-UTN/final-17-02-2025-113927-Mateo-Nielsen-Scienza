import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://679b8dc433d31684632448c9.mockapi.io/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<User> {
    if (username === 'admin' && password === 'admin123') {
      const adminUser: User = {
        id: 1,
        username: 'admin',
        password: 'admin123',
        role: 'admin'
      };
      this.currentUserSubject.next(adminUser);
      return of(adminUser);
    }

    // Validación estudiante
    const EMAIL_PATTERN = /^[0-9]+@tecnicatura\.frc\.utn\.edu\.ar$/;
    if (!EMAIL_PATTERN.test(username)) {
      return throwError(() => new Error('El correo debe ser institucional'));
    }

    const legajo = username.split('@')[0];
    if (password !== legajo) {
      return throwError(() => new Error('La contraseña debe ser su número de legajo'));
    }

    const studentUser: User = {
      id: parseInt(legajo),
      username: username,
      password: password,
      role: 'student'
    };

    this.currentUserSubject.next(studentUser);
    return of(studentUser);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    return this.getCurrentUser()?.role === role;
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }
}
