import { Routes } from '@angular/router';
import { ScoresComponent } from './components/scores/scores.component';
import { GameComponent } from './components/game/game.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard],
    data: { requiresAuth: false }
  },
  { 
    path: 'game',
    component: GameComponent,
    canActivate: [authGuard]
  },
  {
    path: 'scores',
    component: ScoresComponent,
    canActivate: [authGuard],
    data: { role: 'student' }
  },
  {
    path: 'admin/scores',
    component: ScoresComponent,
    canActivate: [authGuard],
    data: { role: 'admin' }
  },
  { path: '', redirectTo: '/game', pathMatch: 'full' }
];
