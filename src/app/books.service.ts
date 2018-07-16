import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable,throwError,of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {Book} from './book';



@Injectable({
  providedIn: 'root'
})
export class BooksService {
  
  constructor(private http: HttpClient) {}

  urlApi: string = 'http://localhost:4500/api/books/';

  getBooks = ():Observable<Book[]> => {
    return this.http.get<Book[]>(this.urlApi)
      .pipe(
        catchError(this.handleError('getCompanies',[]))
      )
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
 
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  
}
