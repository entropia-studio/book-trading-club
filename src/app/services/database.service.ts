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
  booksRequest: Book[];

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

  setRequestBooks = (books: Book[]): void => {
    this.booksRequest = books;
    console.log("booksRequest",this.booksRequest);
  } 
  
  // Returns the book selected for the request that belongs to the user
  getBookRequestUser = (): Book => {
    var mBook = this.booksRequest.filter(book => {
      return book.disabled !== true && book.username === this.getUsername();
    });
    return mBook[0];
  }  

  // Returns the book selected for the request that not belongs to the user
  getBookRequest = (): Book => {
    var mBook = this.booksRequest.filter(book => {
      return book.disabled !== true && book.username !== this.getUsername();
    });
    return mBook[0];
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
