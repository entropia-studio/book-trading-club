import { Component, OnInit, Input } from '@angular/core';
import {DatabaseService} from '../services/database.service';
import {Request} from '../interfaces/request';
import {User} from '../interfaces/user';
import {AuthService} from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {  

  constructor(
    private databaseService: DatabaseService,
    private authService: AuthService,
    private router: Router
  ) { }

  requests: Request[];
  user: User;
  cardTitle: string;

  ngOnInit() {
    this.user = this.authService.user;

    switch (this.router.url){
      case '/requests':
        this.cardTitle = 'Requests';
        this.databaseService.getRequests().subscribe(requests => {
          this.requests = requests;
        });
        break;
      case '/requests/incoming':
        this.cardTitle = 'Incoming requests';
        this.databaseService.getUserRequests(this.user.username).subscribe(requests => {
          this.requests = requests;
        });
        break;
      case '/trades':
        this.cardTitle = 'Trades';
        this.databaseService.getTrades().subscribe(requests => {
          this.requests = requests;
        });
        break;
    }    
  }

  rejectRequest(request: Request){    
    request.status = 'reject';
    this.databaseService.setRequest(request).then(requests => {      
      this.requests = requests;
    })
  }

  acceptRequest(request: Request){
    request.status = 'trade';
    this.databaseService.setRequest(request).then(requests => {      
      this.requests = requests;
    })  
    this.router.navigate(['trades']);
  }

  deleteRequest(idRequest: string){
    this.databaseService.deleteRequest(idRequest).subscribe(requests => {      
      this.requests = requests;
    })
  }



}
