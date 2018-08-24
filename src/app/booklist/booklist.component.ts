import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {SelectionModel, DataSource} from '@angular/cdk/collections';
import {MatTableDataSource, MatSort} from '@angular/material';
import {DatabaseService} from '../services/database.service';
import {Book} from '../interfaces/book';

@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.css']
})
export class BooklistComponent implements OnInit {

  @Input() dataSource: MatTableDataSource<Book>;
  @Input() cardTitle: string;
  


  displayedColumns: string[] = ['select', 'title', 'description', 'username'];      
  selection = new SelectionModel<Book>(true, []);
  username: string = '';
  constructor(private dataBaseService: DatabaseService) {
    
  }

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
    //this.username = this.dataBaseService.getUsername();
  }

  deleteBook(bookId: string):void {    
    console.log('id',bookId);
    /*
    this.selection.selected.forEach(select => {      
      let document = this.dataSource.data.find(book => {
        return book.title == select.title && book.username == select.username;
      })
      if (document){
        this.dataBaseService.deleteBook(document.id);
        console.log('id',document.id);
      }
        
    })*/   
  }  

}
