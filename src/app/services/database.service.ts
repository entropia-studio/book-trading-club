import { Injectable } from '@angular/core';
import { Observable,throwError,of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {Book} from '../interfaces/book';
import { AngularFirestore,AngularFirestoreCollection } from 'angularfire2/firestore';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  
  private booksCollection: AngularFirestoreCollection<Book>;
  books: Observable<Book[]>;

  constructor(private afs: AngularFirestore,) {}
  


  getBooks = ():Observable<Book[]> => {        
    this.booksCollection = this.afs.collection<Book>('books',ref => ref.orderBy('username','asc'));
    // Obtain id from the document (metadata)
    this.books = this.booksCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Book;
        const id = a.payload.doc.id;        
        return { id, ...data };
      }))
    )
    return this.books;    
  }

  getUsers = ():Observable<any[]> => {    
    return this.afs.collection('/users').valueChanges();
  }

  getUsername = () : string => {    
    return 'javier';
  }

  addBook = (book: Book): void => {   
    this.booksCollection = this.afs.collection<Book>('books');
    this.booksCollection.add(book).then(() => {
      console.log('Book added',book)
    }).catch(error => {
      console.error("error",error);
    });
  }

  
  deleteBook = (id: string): Promise<void> => {
    this.booksCollection = this.afs.collection<Book>('books');
    return this.booksCollection.doc(id).delete();
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
