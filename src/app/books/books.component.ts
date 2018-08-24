import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource, MatSort} from '@angular/material';
import {DatabaseService} from '../services/database.service';
import {AuthService} from '../services/auth.service';
import {Book} from '../interfaces/book';
import {User} from '../interfaces/user';
import {Router} from '@angular/router';




@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {  

  @Input() parentUserName: string;
  

  books: Book[];
  user: User;
  username: string;  
  requesButtonDisabled: boolean = true;

  constructor(    
    private dataBaseService: DatabaseService,
    private authService: AuthService,
    private router: Router) {}   

  ngOnInit() {          
      this.user = this.authService.user;
      this.dataBaseService.user = this.user;
      console.log('Books.js user: ',this.user.username);
      this.getBooks();
  }

  getBooks(): void {
    
    this.dataBaseService.getBooks().subscribe(books => {                              
      this.books = [];
      books.map(book => {
        this.books.push({
          id: book.id,
          title: book.title,
          description: book.description,
          username: book.username,
          disabled: false
        });

        if (this.parentUserName && this.parentUserName !== book.username){
          console.log(book);
          this.books.pop();
        }
        
      })

      //console.log('1st books: ',this.books);
      //this.books = books;
      // Add book component only shows the user books
      /*
      if (this.parentUserName){       
        this.dataSourceUser.data = books.filter(book => {
          return book.username == this.parentUserName;
        });
      }else{
        this.dataSourceUser.data = books.filter(book => {
          return book.username == this.user.username;
        });
        this.dataSource.data = books.filter(book => {
          return book.username !== this.user.username;
        });  
      }         
      */
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
    // Need to activate the New request button
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
      // Count the selected books that not belong the username
      if (book.username !== username && !book.disabled){        
        booksChecked++;
      }
      
    })        
    // New request active only if the user has selected one general book and one own book
    this.requesButtonDisabled = booksChecked === 1 ? false : true;    
  }

  onSubmit():void{
    this.dataBaseService.booksRequest = this.books;
    //console.log('this.books',this.books)    
    this.router.navigate(['request/new']);
  }

  

}
