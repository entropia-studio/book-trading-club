import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';
import {Observable} from 'rxjs';
//import 'rxjs/add/operator/switchMap';
import { User } from '../interfaces/user';
import { DatabaseService } from './database.service';
import { Subject } from 'rxjs';
import { nextTick } from 'q';

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
  
  user: User = this.getUser();

  users: User[] = [
    {
      id: '109061927218808238481',
      username: 'Portear Kayaks',
      fullname: 'Portear',
      city: '',
      state: '',
      email: 'portearkayaks@gmail.com',
      books: 0
    },
    {
      id: '113590481568941463362',
      username: 'Entropia Studio',
      fullname: 'Entropia',
      city: 'Paterna',
      state: 'Valencia',
      email: 'info@entropia.studio',
      books: 0
    },

]

  getUser (): User{
    /*
    return {
      id: '',
      username: '',      
      fullname: '',
      city: '',
      state: ''
    }
    */   
    return {
      id: '113590481568941463362',
      username: 'Entropia Studio',
      fullname: 'Entropia',
      city: 'Paterna',
      state: 'Valencia',
      email: 'info@entropia.studio',
      books: 0
    };
  }

  /*
  user: User = {
    id: '113590481568941463362',
    username: 'Entropia Studio',      
    fullname: 'Entropia',
    city: 'city bar',
    state: 'state bar'
  };
  */

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
    
    return this.oAuthLogin(provider).then(oAuthLoginObj => {                 

      this.user = {
        id: oAuthLoginObj.additionalUserInfo.profile['id'],
        username: oAuthLoginObj.additionalUserInfo.profile['name'],
        fullname: oAuthLoginObj.additionalUserInfo.profile['given_name'],
        email: oAuthLoginObj.additionalUserInfo.profile['email'],
        books: 0
      };

      var id = oAuthLoginObj.additionalUserInfo.profile['id'];

      this.databaseService.getUser(id).subscribe(user => {
        console.log('user',user);
        // User doesn't exist in collection
        if (user.length === 0){          
          this.databaseService.addUser(this.user);
        }else{
          this.user = user[0];
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

    this.user = this.getUser();
    this.navStateSource.next(this.user); 
  }
  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider);
  }
}
