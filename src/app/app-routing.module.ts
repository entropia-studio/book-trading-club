import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BooksComponent} from './books/books.component';
import {AddbookComponent} from './addbook/addbook.component';
import {RequestnewComponent} from './requestnew/requestnew.component';
import {RequestsComponent} from './requests/requests.component';
import {UsersComponent} from './users/users.component';
import { LoginComponent } from './login/login.component';




const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full'},
  { path: 'books' , component: BooksComponent},
  { path: 'addbook' , component: AddbookComponent},
  { path: 'requests' , component: RequestsComponent},
  { path: 'request/new' , component: RequestnewComponent},  
  { path: 'users' , component: UsersComponent},
  { path: 'login' , component: LoginComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  
})
export class AppRoutingModule { }
