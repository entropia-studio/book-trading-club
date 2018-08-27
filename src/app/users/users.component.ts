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

  users: User[] = [];  

  ngOnInit() {
    this.getUsers();
  }

  getUsers():void{
    this.dataService.getUsers().subscribe(users => {    
      this.users = users;
    })
  }

}
