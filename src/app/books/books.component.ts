import { Component, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {BooksService} from '../books.service';
import {Book} from '../book';





@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  constructor(private booksService: BooksService) { }
  BOOK_DATA: Book[] = [];

  displayedColumns: string[] = ['select', 'title', 'description', 'username'];
  dataSource = new MatTableDataSource<Book>(this.BOOK_DATA);
  selection = new SelectionModel<Book>(true, []);
  

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
    this.booksService.getBooks().subscribe(book => {      
      Object.assign(this.BOOK_DATA,book);      
    })
  }

}
