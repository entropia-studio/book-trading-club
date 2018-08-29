import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';
//import 'rxjs/add/operator/switchMap';
import { User } from '../interfaces/user';
import { DatabaseService } from './database.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private databaseService: DatabaseService
  ) {}

  // Communication with the menu
  private navStateSource = new Subject<User>();
  navState$ = this.navStateSource.asObservable();
  

  user: User;

  login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Sucess', value);
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
    
    return this.oAuthLogin(provider).then(oAuthLoginObj => {                 

      this.user = {
        id: oAuthLoginObj.additionalUserInfo.profile['id'],
        username: oAuthLoginObj.additionalUserInfo.profile['name'],
        fullname: oAuthLoginObj.additionalUserInfo.profile['given_name'],
        email: oAuthLoginObj.additionalUserInfo.profile['email'],
        books: 0,
        incoming: 0
      };

      var id = oAuthLoginObj.additionalUserInfo.profile['id'];
      
      this.databaseService.getUser(id).then(user => {
        
        // User exists in collection
        if (user.exists){          
          this.user = user.data();          
        }else{
          this.databaseService.addUser(this.user);
        }        
        this.navStateSource.next(this.user);         
      })             
    }).catch(error => {
        console.log('Something went wrong: ', error);
    });      
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });

    this.user = undefined;
    this.navStateSource.next(this.user); 
  }
  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider);
  }
}
