import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {Book} from '../interfaces/book';
import {Request} from '../interfaces/request';
import {User} from '../interfaces/user';
import { AngularFirestore,AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  
  private booksCollection: AngularFirestoreCollection<Book>;
  private requestsCollection: AngularFirestoreCollection<Request>;  
  private requestDocument: AngularFirestoreDocument<Request>;
  private usersCollection: AngularFirestoreCollection<User>;
  private userDocument: AngularFirestoreDocument<User>;
  books: Observable<Book[]>;
  booksRequest: Book[];

  constructor(private afs: AngularFirestore,    
  ) {}
  
  user: User;

  // Book functions

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

  addBook = (book: Book): void => {   
    this.booksCollection = this.afs.collection<Book>('books');
    this.booksCollection.add(book).then(() => {            
      // Add book to the user
      this.user.books++;
      this.setUser(this.user);

    }).catch(error => {
      console.error("error",error);
    });
  }

  deleteBook = (id: string): Promise<void> => {
    this.booksCollection = this.afs.collection<Book>('books');
    return this.booksCollection.doc(id).delete().then(book => {
      // Delete book to the user      
      this.user.books--;
      this.setUser(this.user);
    });
  }  

  // Requests functions

  getRequests = ():Observable<Request[]> => {        
    this.requestsCollection = this.afs.collection<Request>
      ('requests',ref => ref.where('status','==','pending').orderBy('date','desc'));    
    return this.requestsCollection.valueChanges();    
  }

  getUserRequests = (username: string): Observable<Request[]> => {        
    this.requestsCollection = this.afs.collection<Request>
      ('requests',ref => ref.where('status','==','pending').where('usernameTo','==',username).orderBy('date','desc'));    
    return this.requestsCollection.valueChanges();   
  }

  deleteRequest = (idRequest: string): Observable<Request[]> => {            
    var requestsObs: Observable<Request[]>;
    this.requestsCollection = this.afs.collection<Request>('requests',ref => ref.where('status','==','pending').orderBy('date','desc'));
    requestsObs = this.requestsCollection.valueChanges();
    this.requestsCollection.doc(idRequest).delete();      
    return requestsObs;    
  }

  setRequest = (request: Request): Promise<any> => {
    this.requestDocument = this.afs.collection<Request>('requests').doc(request.id);
    return this.requestDocument.update(request);
  }  

  // Returns request document to insert into collection
  getRequest = (): Request => {
    
    let bookFrom, bookTo: Book;
    bookFrom = this.getBookRequestFrom();
    bookTo = this.getBookRequestTo();    
    let request: Request = {
      usernameFrom: bookFrom.username,
      usernameTo: bookTo.username,
      status: 'pending',
      bookFrom: this.sanitizeBook(bookFrom),
      bookTo: this.sanitizeBook(bookTo),
      date: Date.now()
    }
    return request;
  }

  // Returns the book selected for the request that belongs to the user
  getBookRequestFrom = (): Book => {
    var mBook = this.booksRequest.filter(book => {
      return book.disabled !== true && book.username === this.user.username;
    });
    return mBook[0];
  }  

  // Returns the book selected for the request that not belongs to the user
  getBookRequestTo = (): Book => {
    var mBook = this.booksRequest.filter(book => {
      return book.disabled !== true && book.username !== this.user.username;
    });
    return mBook[0];
  }

  createRequest(request: Request): Promise<any>{    
    const id = this.afs.createId();
    request.id = id;

    this.requestsCollection = this.afs.collection<Request>('requests');        

    return this.requestsCollection.doc(id).set(request);
    
  }


  getTrades = (): Observable<Request[]> => {        
    this.requestsCollection = this.afs.collection<Request>
      ('requests',ref => ref.where('status','==','trade').orderBy('date','desc'));    
    return this.requestsCollection.valueChanges();    
  }

  // User functions 

  getIdUser = (username: string) : Observable<User[]> => { 
   
    
    this.usersCollection = this.afs.collection<User>
      ('users',ref => ref.where('username','==',username));
    
    let user: Observable<User[]> = this.usersCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as User;
          const id = a.payload.doc.id;        
          return { id, ...data };
        }))
      )    
    return user;
  }

  getUsers = ():Observable<any[]> => {    
    return this.afs.collection('/users').valueChanges();
  }    

  addUser = (user: User): void => {    
    let userObs: Observable<User[]>;
    // Search the user by ID
    this.usersCollection = this.afs.collection<User>('users',ref => ref.where('id','==',user.id));
    
    userObs = this.usersCollection.valueChanges();
    userObs.subscribe(mUser => {
      // If user never has logged previously add to collection users
      if (mUser.length === 0){
        this.usersCollection.doc(user.id).set(user).then().catch(error => {
          console.error("error",error);
        });
      }      
    })        
  }

  updateUser = (user: User): Promise<any> => {    
    this.userDocument = this.afs.collection<User>('users').doc(user.id);
    return this.userDocument.update(user);
  }

  // Returns the user document if exists, if not returns a empty user object
  getUser = (id: string) : Promise<any> => {
    console.log('id',id)     
    console.log('type',typeof id)
    return this.afs.collection<User>('users').doc(id).ref.get();
  } 


  setUser = (user: User): Promise<any> => {
    this.userDocument = this.afs.collection<User>('users').doc(user.id);
    return this.userDocument.update(user);
  } 

  // Sanitize the book object to insert into document
  sanitizeBook = (book: Book): Book => {
    book = {
        id: book.id,
        user_id: book.user_id,
        title: book.title,
        description: book.description,  
        username: book.username      
    }
    return book;
  }
  
  

  
}
