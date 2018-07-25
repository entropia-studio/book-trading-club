import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../services/database.service';
import {Book} from '../interfaces/book';
import {Router} from '@angular/router';

@Component({
  selector: 'app-requestnew',
  templateUrl: './requestnew.component.html',
  styleUrls: ['./requestnew.component.css']
})
export class RequestnewComponent implements OnInit {

  constructor(    
    private dataBaseService: DatabaseService,
    private router: Router) {} 

  bookUser: Book;
  book: Book;
    
  ngOnInit() {    
    console.log('books',this.dataBaseService.booksRequest);
    this.bookUser = this.dataBaseService.getBookRequestUser();
    this.book = this.dataBaseService.getBookRequest();
  }

}
