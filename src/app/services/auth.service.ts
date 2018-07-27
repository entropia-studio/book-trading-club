import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';
import {Observable} from 'rxjs';
//import 'rxjs/add/operator/switchMap';
import { User } from '../interfaces/user';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private databaseService: DatabaseService
  ) { }
  
  user: User;

  login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
        this.router.navigateByUrl('/profile');
      })
      .catch(err => {
        console.log('Something went wrong: ', err.message);
      });
  }
  emailSignup(email: string, password: string) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Sucess', value);
        this.router.navigateByUrl('/profile');
      })
      .catch(error => {
        console.log('Something went wrong: ', error);
      });
  }
  googleLogin(): Promise<void> {
    
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider).then(value => {      
      this.user = {
        id: value.additionalUserInfo.profile.id,
        username: value.additionalUserInfo.profile.name,
        fullname: value.additionalUserInfo.profile.given_name,
        email: value.additionalUserInfo.profile.email,
        books: 0
      };
      this.databaseService.addUser(this.user);      

    }).catch(error => {
        console.log('Something went wrong: ', error);
    });      
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }
  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider);
  }
}
