import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatFactData } from '../cats.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getMeowFacts(): Observable<CatFactData> {
    return this.http.get<CatFactData>('https://meowfacts.herokuapp.com/');
  }
}
