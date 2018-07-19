import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable,throwError,of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {Book} from '../interfaces/book';
import { AngularFirestore } from 'angularfire2/firestore';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  
  constructor(private http: HttpClient,private db: AngularFirestore,) {}

  urlApi: string = 'http://localhost:4500/api/books/';

  getBooks = ():Observable<any[]> => {    
    return this.db.collection('/books').valueChanges();
  }

  getUsers = ():Observable<any[]> => {    
    return this.db.collection('/users').valueChanges();
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
