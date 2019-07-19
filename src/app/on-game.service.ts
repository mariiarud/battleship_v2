import { Injectable, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnGameService implements OnInit {
  socket: any;
  
  constructor(socket) { 
    this.socket = socket;
  }

  ngOnInit() {

  }

  // setSocket (socket){
  //   this.socket = socket;

  //   this.socket.on("renewEnemyField", data => {
  //     this.myBoard$ = data;
  //     // console.log(data);
  //   });
  // }

  getBoards(playerId, currentRoom){
    this.socket.emit("getStartingParameters", playerId, currentRoom);
  }

  shot(currentRoom, playerId, enemyField, point){
    this.socket.emit("shot", currentRoom, playerId, enemyField, point);
  }

  getMyBoard(): any{
    return this.observeEvent("myBoard");
  }

  getTurn(): any{
    return this.observeEvent("isTurn");
  }

  getEnemyField(): any{
    return this.observeEvent("renewEnemyField");
  }

  getMyField(): any{
    return this.observeEvent("renewField");
  }

  changeTurn(): any{
    return this.observeEvent("changeTurn");
  }

  onWin(): any{
    return this.observeEvent("win");
  }

  onLose(): any{
    return this.observeEvent("lose");
  }

  observeEvent(eventName: string): any{
    let soketObservable = new Observable(observer => {
      this.socket.on(eventName, (data) => {
        observer.next(data);
      });
    });
    return soketObservable;
  }
}
