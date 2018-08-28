import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import {DatabaseService} from '../services/database.service';
import {AuthService} from '../services/auth.service';
import {Book} from '../interfaces/book';
import {User} from '../interfaces/user';
import {Router} from '@angular/router';
import { Observable, Subscription } from 'rxjs';




@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit, OnDestroy {  

  @Input() parentUserName: string;  
 

  books: Book[];
  user: User;
  username: string;  
  requesButtonDisabled: boolean = true;
  booksObs: Subscription;

  constructor(    
    private dataBaseService: DatabaseService,
    private authService: AuthService,
    ) {}   

  ngOnInit() {          
      this.user = this.authService.user;
      this.dataBaseService.user = this.user;      
      this.booksObs = this.getBooks();
  }

  getBooks(): Subscription {
    
    return this.dataBaseService.getBooks().subscribe(books => {                              
      this.books = [];
      books.map(book => {
        this.books.push({
          id: book.id,
          user_id: book.user_id,
          title: book.title,
          description: book.description,
          username: book.username,
          disabled: false,
          selected: false
        });

        if (this.parentUserName && this.parentUserName !== book.username){          
          this.books.pop();
        }        
      })      
    })      
  }

  deleteBook(bookId: string):void {        
    this.dataBaseService.deleteBook(bookId);    
  }    

  // Check/Uncheck books to avoid multiple selection
  // Only is possible to check one book from the user and other one from the library
  // to perform a new request
  toggleCheck(index: number, checked: boolean): void{       
    const username: string = this.books[index].username;    
    // Needed to activate the New request button
    var booksChecked: number = 0;
    this.books.map((book,i) => {      
      if (checked){        
        if (username === this.user.username){
          this.books[i].disabled = i !== index && book.username === username ? true :  book.disabled;                            
        }else{
          this.books[i].disabled = i !== index && book.username !== this.user.username ? true :  book.disabled;                
        }                    
      }else{
        if (username === this.username){
          this.books[i].disabled = username === book.username ?  false : book.disabled;
        }else{
          this.books[i].disabled = this.username !== book.username ?  false : book.disabled;
        }                
      }                  
    })        
    this.books[index].selected = checked === true ? true : false;  
    this.books.map(book => {
      if (book.selected)
      booksChecked++;
    })
    console.log('booksChecked: ',booksChecked)
    console.log('Books ->',this.books);
    // New request active only if the user has selected one general book and one own book
    this.requesButtonDisabled = booksChecked === 2 ? false : true;    
  }

  ngOnDestroy(){
    this.dataBaseService.booksRequest = this.books;
    this.booksObs.unsubscribe();    
  }

  

}
