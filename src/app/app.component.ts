import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router'; // Agregar Router
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router 
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); 
  }
}
