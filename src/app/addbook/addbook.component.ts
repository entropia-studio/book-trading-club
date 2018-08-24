import { Component, OnInit } from '@angular/core';
import {Book} from '../interfaces/book';
import {DatabaseService} from '../services/database.service';
import {AuthService} from '../services/auth.service';
import {FormControl, FormGroup, Validators, FormGroupDirective} from '@angular/forms';




@Component({
  selector: 'app-addbook',
  templateUrl: './addbook.component.html',
  styleUrls: ['./addbook.component.css']
})
export class AddbookComponent implements OnInit {

  constructor(
    private dataBaseService: DatabaseService,
    private authService: AuthService
  ) { }  

  ngOnInit() {
  }

  parentUserName: string = this.authService.user.username;

  bookForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,            
    ]),
    description: new FormControl('', [
      Validators.required,      
    ]),
  });
  

  onSubmit(formDirective: FormGroupDirective) {   
    this.addBook();
    // Necessary to reset the form when uses material
    formDirective.resetForm();
    this.bookForm.reset();    
  }

  addBook = () : void => { 

    let book: Book = {
      title: this.bookForm.get('title').value,
      description: this.bookForm.get('description').value,
      username: this.authService.user.username
    }
    this.dataBaseService.addBook(book);
    
  }

  

  
}
