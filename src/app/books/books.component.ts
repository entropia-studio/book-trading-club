import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource, MatSort} from '@angular/material';
import {DatabaseService} from '../services/database.service';
import {Book} from '../interfaces/book';



@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {  

  @Input() parentUserName: string;
  @ViewChild(MatSort) sort: MatSort;

  books: Book[] = [];
  username: string;  
  requesButtonDisabled: boolean = true;

  constructor(    
    private dataBaseService: DatabaseService) {} 
  

  displayedColumns: string[] = ['select', 'title', 'description', 'username'];    
  dataSource = new MatTableDataSource<Book>();
  selection = new SelectionModel<Book>(true, []);

  dataSourceUser = new MatTableDataSource<Book>();
  selectionUser = new SelectionModel<Book>(true, []);
  
    
  /** Whether the number of selected elements matches the total number of rows. */ 
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */ 
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }  

  ngOnInit() {    
      this.username = this.dataBaseService.getUsername();
      this.getBooks();
  }

  getBooks(): void {
    
    this.dataBaseService.getBooks().subscribe(books => {                              
      books.map(book => {
        this.books.push({
          id: book.id,
          title: book.title,
          description: book.description,
          username: book.username,
          disabled: false
        })
      })
      //this.books = books;
      // Add book component only shows the user books
      if (this.parentUserName){       
        this.dataSourceUser.data = books.filter(book => {
          return book.username == this.parentUserName;
        });
      }else{
        this.dataSourceUser.data = books.filter(book => {
          return book.username == this.dataBaseService.getUsername();
        });
        this.dataSource.data = books.filter(book => {
          return book.username !== this.dataBaseService.getUsername();
        });  
      }   
      console.log('DataSource: ',this.dataSource.data);   
    
    })      
  }

  deleteBook(bookId: string):void {        
    this.dataBaseService.deleteBook(bookId);    
  }    

  // Check or uncheck the elements depending on its state
  // It takes into account books from the user and the other ones
  toggleCheck(bookForm: Book, checked: boolean): void{   
    console.log('Book',bookForm);
    if (checked){
      this.books.map((book,index) => {
        if (book.id != bookForm.id && book.username == bookForm.username){
          this.books[index].disabled = true;
        }
      })
      
    }else{
      this.books.map((book,index) => {        
        if (book.username == bookForm.username)  
          this.books[index].disabled = false;        
      })
    }    
    this.requesButtonDisabled = this.isRequestPossible();
  }

  isRequestPossible():boolean{
    let userBookSelected, otherBookSelected = false;
    this.books.map(book => {
      if (book.username !== this.username && book.disabled === false){
        otherBookSelected = true;
      } 
      if (book.username === this.username && book.disabled === false){
        userBookSelected = true;
      } 
    })
    return userBookSelected && otherBookSelected;
  }

}
