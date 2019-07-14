import { Component, OnInit} from '@angular/core';
import io from "socket.io-client";
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  timeLeft: number = 2;
  title = 'Battleship';
  isCall = false;
  gameStatus = 'home';
  playerId: string = '';
  private socket: any;
  rooms = [];
  currentRoom = -1;
  private notifier: NotifierService;
  score = 20;
  
  public constructor( notifier: NotifierService ) {
		this.notifier = notifier;
	}

  ngOnInit(): void {
    this.socket = io("http://localhost:8080");
  }

  ngAfterViewInit(): void {
    this.socket.on("callReset", ()=>{
      this.isCall=false;
    });
    this.socket.on("roomStatus", data =>{
      this.rooms = data;
    });
    this.socket.on("newPlayer", (id, room) =>{
      this.playerId = id;
      this.gameStatus = 'new';
      this.currentRoom = room;
    });
    this.socket.on("roomIsFull", () =>{
      this.notifier.notify( "warning", "Room is occupied!" );
    });
    this.socket.on("rollCall", id=>{
      if(this.playerId == '' && !this.isCall){
        this.isCall = true;
        this.socket.emit("iAmGuest");
      }
      else
      if(this.playerId == id)
        this.socket.emit("iAmHere", this.playerId, this.currentRoom);
    })
    this.socket.on("startNewGame", ()=>{
      this.gameStatus = 'start';
    });
    this.socket.on("playerLeave", room=>{
      if(this.currentRoom == room){
        this.notifier.notify( "error", "Opponent left the game!" );
        let timeLeft: number = 2;
        let interval = setInterval(() => {
          if(timeLeft > 0) {
            timeLeft--;
          } else {
            this.gameStatus = "home";
            clearInterval(interval);
          }
        },1000);
      }
    });
  }

  joinRoom(i): void {
    this.socket.emit("joinRoom", i);
    
  }
}
