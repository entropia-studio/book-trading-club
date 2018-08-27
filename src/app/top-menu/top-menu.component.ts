import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { User } from '../interfaces/user';


@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {
  
  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    ) { }

  user: User = this.authService.user;  
  numOfRequests: number = 0;

  ngOnInit() {    
    this.authService.navState$.subscribe( (user)=> {
      this.user = user;
      if (user){
        this.databaseService.getUserRequests(this.user.username).subscribe(requests => {        
          this.numOfRequests = requests.length;      
        });
      }      
    });         
  }

  logOut(){    
    this.authService.logout();    
  }
  
  hasProp(o, name) {
    return o.hasOwnProperty(name);
  }

}
