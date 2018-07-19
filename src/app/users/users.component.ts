import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {DatabaseService} from '../services/database.service';
import {User} from '../interfaces/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(private dataService: DatabaseService) { }

  USER_DATA: User[] = [];

  displayedColumns: string[] = ['id','username', 'fullname','books'];
  dataSource = new MatTableDataSource<User>(this.USER_DATA);

  ngOnInit() {
    this.getUsers();
  }

  getUsers():void{
    this.dataService.getUsers().subscribe(users => {
      var user_data: any[] = [];
      users.map(user => {
        let mUser = {
          'id': user.id,
          'username': user.username,
          'fullname': user.fullname,
          'books': user.books.length
          }
        user_data.push(mUser);
      })      
      Object.assign(this.USER_DATA,user_data);
    })
  }

}
