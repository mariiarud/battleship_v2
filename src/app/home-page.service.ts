import { Injectable } from '@angular/core';
import io from "socket.io-client";
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomePageService{

  socket: any;
  playerId: string = '';
  currentRoom = -1;
  isCall = false;

  constructor() { 
    this.socket = io("http://localhost:3200");

    this.socket.on("callReset", ()=>{
      this.isCall=false;
    });

    this.socket.on("newPlayerInfo", (id, room) =>{
      this.playerId = id;
      this.currentRoom = room;
    });

    this.socket.on("rollCall", id=>{
      if(this.playerId == '' && !this.isCall){
        this.isCall = true;
        this.socket.emit("iAmGuest");
      }
      else
      if(this.playerId == id)
        this.socket.emit("iAmPlayer", this.playerId, this.currentRoom);
    });
  }

  getRooms(){
    return this.observeEvent("rooms");
  }

  changeGameStatus(){
    return this.observeEvent("changeGameStatus");
  }

  roomIsFull(){
    return this.observeEvent("roomIsFull");
  }

  opponentLeave(){
    return this.observeEvent("opponentLeave");
  }

  waitOpponent(){
    return this.observeEvent("waitOpponent");
  }

  observeEvent(eventName: string): any{
    let soketObservable = new Observable(observer => {
      this.socket.on(eventName, (data) => {
        observer.next(data);
      });
    });
    return soketObservable;
  }

  joinRoom(i){
    this.socket.emit("joinRoom", i);
  }

  startGame(myBoard){
    this.socket.emit("startGame", this.currentRoom, this.playerId, myBoard);
  }
}
