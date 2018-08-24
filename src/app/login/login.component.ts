import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {  

  constructor(
    private authService: AuthService,
    private router: Router) {}

  ngOnInit() {   
  }

  loginGoogle(){
    this.authService.googleLogin().then(() => {                  
      this.router.navigate(['books']);      
    });    
  }
  
 

}
