import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BooksComponent} from './books/books.component';
import {AddbookComponent} from './addbook/addbook.component';
import {UsersComponent} from './users/users.component';
import {NameEditorComponent} from './name-editor/name-editor.component';



const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full'},
  { path: 'books' , component: BooksComponent},
  { path: 'addbook' , component: AddbookComponent},
  { path: 'users' , component: UsersComponent},
  { path: 'name' , component: NameEditorComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  
})
export class AppRoutingModule { }
