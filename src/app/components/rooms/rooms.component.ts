import { Component, OnInit } from '@angular/core';
import {BattleshipService} from '../../services/battleship.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})

export class RoomsComponent implements OnInit {
rooms: number[] = new Array;

  constructor(private battleshipService: BattleshipService) { 
  }

  ngOnInit(){
    this.battleshipService.getRooms().subscribe((data) => {
      this.rooms = data;
    });
  }

  joinRoom(i) {
      this.battleshipService.joinRoom(i);
  }

}


