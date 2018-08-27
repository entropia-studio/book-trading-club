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
      let obs = this.dataBaseService.getUser(this.request.bookTo.user_id).subscribe(user => {        
        user[0].incoming++;     
        obs.unsubscribe();
        this.dataBaseService.updateUser(user[0]).then(() => {
          this.router.navigate(['requests']);          
        })
      })  
    });
  }

}
