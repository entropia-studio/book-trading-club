import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../services/database.service';
import {Request} from '../interfaces/request';
import {Router} from '@angular/router';

@Component({
  selector: 'app-requestnew',
  templateUrl: './requestnew.component.html',
  styleUrls: ['./requestnew.component.css']
})
export class RequestnewComponent implements OnInit {

  request: Request;

  constructor(    
    private dataBaseService: DatabaseService,
    private router: Router) {} 
    
  ngOnInit() {        
    this.request = this.dataBaseService.getRequest();
  }

  acceptRequest(){    
    this.dataBaseService.createRequest(this.request).then(() => {
      this.router.navigate(['requests']);
    });
  }

}
