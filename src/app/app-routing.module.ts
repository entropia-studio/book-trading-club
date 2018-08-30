import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BooksComponent} from './books/books.component';
import {AddbookComponent} from './addbook/addbook.component';
import {RequestnewComponent} from './requestnew/requestnew.component';
import {RequestsComponent} from './requests/requests.component';
import {UsersComponent} from './users/users.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';




const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full'},
  { path: 'books' , component: BooksComponent},
  { path: 'books/:id' , component: BooksComponent},
  { path: 'addbook' , component: AddbookComponent},
  { path: 'request/new' , component: RequestnewComponent},  
  { path: 'requests' , component: RequestsComponent},  
  { path: 'requests/incoming' , component: RequestsComponent},  
  { path: 'trades' , component: RequestsComponent},  
  { path: 'users' , component: UsersComponent},
  { path: 'login' , component: LoginComponent},
  { path: 'profile' , component: ProfileComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  
})
export class AppRoutingModule { }
