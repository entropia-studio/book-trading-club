import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {
  
  constructor(private authService: AuthService) { }
  user: User;
  userIsLogged: boolean = true;

  ngOnInit() {
  }

  loginGoogle(){
    this.authService.googleLogin().then(() => {      
      this.user = this.authService.user;      
      this.userIsLogged = true;
    });    
  }
  
  logOut(){
    this.authService.logout();
    this.userIsLogged = false;
  }

}
