import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom, tap } from 'rxjs';
import { Score } from '../interfaces/score';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private apiUrl = 'https://671fe287e7a5792f052fdf93.mockapi.io/scores';

  constructor(private http: HttpClient) {
    console.log('ScoreService initialized');
    console.log('API URL:', this.apiUrl);
  }

  getScores(): Observable<Score[]> {
    console.log('Fetching scores...');
    return this.http.get<Score[]>(this.apiUrl).pipe(
      tap({
        next: (scores) => console.log('Scores received:', scores),
        error: (error) => console.error('Error fetching scores:', error)
      })
    );
  }

  saveScore(score: Score): Observable<Score> {
    return this.http.post<Score>(this.apiUrl, score);
  }

  async generateGameId(playerName: string): Promise<string> {
    const names = playerName.split(' ');
 
    const initials = names[0][0] + names[names.length-1][0];
    
    const scores = await firstValueFrom(this.getScores());
    const userGames = scores.filter(s => s.playerName === playerName);
    const gameCount = userGames.length + 1;
    
    return `P${gameCount}${initials.toUpperCase()}`;
  }
}
