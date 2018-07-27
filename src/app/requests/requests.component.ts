import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../services/database.service';
import {Request} from '../interfaces/request';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  constructor(private databaseService: DatabaseService) { }
  requests: Request[];
  
  ngOnInit() {
    this.databaseService.getRequests().subscribe(requests => {
      this.requests = requests;
    })
  }

}
