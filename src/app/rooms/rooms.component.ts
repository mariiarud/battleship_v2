import { Component, OnInit } from '@angular/core';
import {HomePageService} from '../home-page.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
rooms: number[] = new Array;

  constructor(private homePageService: HomePageService) { 
    this.homePageService.getRooms().subscribe((data) => {
      this.rooms = data;
    });
  }

  ngOnInit(){

  }

  joinRoom(i) {
      this.homePageService.joinRoom(i);
  }

}
