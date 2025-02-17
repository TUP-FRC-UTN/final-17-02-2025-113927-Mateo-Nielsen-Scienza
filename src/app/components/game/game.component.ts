import { Component, OnInit } from '@angular/core';
import { WordService } from '../../services/word.service';
import { CommonModule } from '@angular/common';
import { ScoreService } from '../../services/score.service';
import { Score } from '../../interfaces/score';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit{

  word: string = '';
  hiddenWord: string[] = [];
  attemptsLeft: number = 6;
  incorrectLetters: string[] = [];
  correctLetters: string[] = [];
  message: string = '';
  gameEnded: boolean = false;

  constructor(
    private wordService: WordService,
    private scoreService: ScoreService,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.startGame();
  }

  isPartVisible(attempt: number): boolean {
    return this.attemptsLeft < 6 - attempt;

  }
  
 
  private normalizeText(text: string): string {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  startGame(): void {
    this.wordService.getWords().subscribe({
      next: (words) => {
       
        const randomWord = this.normalizeText(words[Math.floor(Math.random() * words.length)].word.toUpperCase());
        this.word = randomWord;
        this.hiddenWord = Array(this.word.length).fill('_');
        console.log('Nueva palabra:', this.word);
      },
      error: (error) => {
        console.error('Error al obtener palabra:', error);
      }
    });
  }

  guessLetter(letter: string): void {
    if (this.gameEnded) return;
    

    const normalizedLetter = this.normalizeText(letter.toUpperCase());
    const normalizedWord = this.normalizeText(this.word);
    
    if (normalizedWord.includes(normalizedLetter)) {
      this.correctLetters.push(letter);
      this.word.split('').forEach((char, index) => {
        if (this.normalizeText(char) === normalizedLetter) {
          this.hiddenWord[index] = this.word[index]; // Mantener la letra original con acento
        }
      });
    } else {
      this.incorrectLetters.push(letter);
      this.attemptsLeft--;
    }

    this.checkGameStatus();
  }

  checkGameStatus(): void {
    if (this.hiddenWord.join('') === this.word) {
      this.message = '¡Felicidades! Has adivinado la palabra.';
      this.gameEnded = true;
      this.saveScore().then(() => {
      
        setTimeout(() => {
          this.resetAndStartNewGame();
        }, 2000);
      });
    } else if (this.attemptsLeft === 0) {
      this.message = 'Lo siento, has perdido. La palabra era: ' + this.word;
      this.gameEnded = true;
      this.saveScore().then(() => {
        setTimeout(() => {
          this.resetAndStartNewGame();
        }, 2000);
      });
    }
  }

  private resetAndStartNewGame(): void {
   
    this.word = '';
    this.hiddenWord = [];
    this.attemptsLeft = 6;
    this.incorrectLetters = [];
    this.correctLetters = [];
    this.message = '';
    this.gameEnded = false;
    
   
    this.startGame();
  }
  
  calculateScore(): number {
    switch (this.attemptsLeft) {
      case 6: return 100;
      case 5: return 80;
      case 4: return 60;
      case 3: return 40;
      case 2: return 20;
      case 1: return 10;
      default: return 0;
    }
  }

  async saveScore(): Promise<void> {
    try {
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        console.error('No user authenticated');
        return;
      }
      
      
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0]; 
      
      const score: Score = {
        id: '', 
        playerName: currentUser.username,
        word: this.word,
        attemptsLeft: this.attemptsLeft,
        date: formattedDate,
        score: this.calculateScore(),
        idGame: await this.scoreService.generateGameId(currentUser.username)
      };
      
      console.log('Score to be saved:', score);
      
      this.scoreService.saveScore(score).subscribe({
        next: (savedScore) => {
          console.log('Score saved successfully:', savedScore);
        },
        error: (error) => {
          console.error('Error saving score:', error);
        }
      });
    } catch (error) {
      console.error('Error in saveScore:', error);
    }
  }

}