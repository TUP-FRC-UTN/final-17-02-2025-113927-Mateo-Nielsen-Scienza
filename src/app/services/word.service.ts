import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Word } from '../interfaces/word';


@Injectable({
  providedIn: 'root'
})
export class WordService {
  private apiUrl = 'https://671fe287e7a5792f052fdf93.mockapi.io/words';

  constructor(private http: HttpClient) {}

  getWords(): Observable<Word[]> {
    return this.http.get<Word[]>(this.apiUrl);
  }
}
