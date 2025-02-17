import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreService } from '../../services/score.service';
import { AuthService } from '../../services/auth.service';
import { Score } from '../../interfaces/score';

@Component({
  selector: 'app-scores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.css'
})
export class ScoresComponent implements OnInit {
  scores: Score[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private scoreService: ScoreService,
    private authService: AuthService
  ) {
    console.log('ScoresComponent initialized');
  }

  ngOnInit() {
    console.log('ScoresComponent ngOnInit');
    this.loadScores();
  }

  loadScores() {
    console.log('Loading scores...');
    this.loading = true;
    this.error = null;
    
    const currentUser = this.authService.getCurrentUser();
    console.log('Current User:', currentUser);

    this.scoreService.getScores().subscribe({
      next: (scores) => {
        console.log('All scores received:', scores);
        
        if (currentUser?.role === 'student') {
          
          this.scores = scores.filter(score => {
            const match = score.playerName === currentUser.username;
            console.log(`Comparing score: ${score.playerName} with user: ${currentUser.username} = ${match}`);
            return match;
          });
          console.log('Filtered scores for student:', this.scores);
        } else {
         
          this.scores = scores.filter(score => score.playerName !== 'admin');
          console.log('Filtered scores for admin (excluding admin scores):', this.scores);
        }

        if (this.scores.length === 0) {
          console.log('No scores found after filtering');
        }

       
        this.scores.sort((a, b) => b.attemptsLeft - a.attemptsLeft);
        console.log('Final sorted scores:', this.scores);
      },
      error: (error) => {
        console.error('Error loading scores:', error);
        this.error = 'Error al cargar las puntuaciones';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        console.log('Scores loading completed');
      }
    });
  }
}
