import { Component, OnInit } from '@angular/core';
import {User} from '../interfaces/user';
import {DatabaseService} from '../services/database.service';
import {AuthService} from '../services/auth.service';
import {FormControl, FormGroup, Validators, FormGroupDirective} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private dataBaseService: DatabaseService,
    private authService: AuthService,
    public snackBar: MatSnackBar,    
  ) { }

  user: User = this.authService.user;

  ngOnInit() {
    this.user = this.authService.user;
  }  

  userForm = new FormGroup({
    fullname: new FormControl(this.user.fullname, [
      Validators.required,   
      Validators.minLength(3)         
    ]),
    city: new FormControl(this.user.city, [            
      Validators.minLength(3)     
    ]),
    state: new FormControl(this.user.state, [           
      Validators.minLength(3)     
    ]),
  });

  onSubmit(formDirective: FormGroupDirective) {   
        
    this.user.fullname = this.userForm.get('fullname').value;
    this.user.city = this.userForm.get('city').value;
    this.user.state = this.userForm.get('state').value;      
    
    this.dataBaseService.updateUser(this.user).then(() => {            
      this.openSnackBar('Profile updated succesfully','Ok')
    }); 
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  

}
