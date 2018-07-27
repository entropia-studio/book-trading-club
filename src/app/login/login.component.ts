import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../interfaces/user';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    /*
    this.authService.googleLogin().then(value => {
      this.user = {
        id: value.additionalUserInfo.id,
        username: value.additionalUserInfo.id,

      };
    });
    */
  }

  logOut(){
    this.authService.logout();
  }
}
