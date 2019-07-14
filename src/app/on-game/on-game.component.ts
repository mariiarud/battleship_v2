import { Component, Input, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NumberSymbol } from '@angular/common';

@Component({
  selector: 'app-on-game',
  templateUrl: './on-game.component.html',
  styleUrls: ['./on-game.component.css']
})
export class OnGameComponent implements OnInit {
  @Input() socket: any;
  @Input() playerId: string;
  @Input() currentRoom: string;
  private notifier: NotifierService;
  myBoard: number[][] = new Array();
  myEnemyBoard: number[][] = new Array();
  realEnemyBoard: number[][] = new Array();
  boardTable = [['','a','b','c','d','e','f','g','h','i','j']];
  isTurn: boolean = false;
  gameStatus = 'wait';
  //play
  ship = new Map();
  constructor(notifier: NotifierService) { 
    this.notifier = notifier;
      for (var i = 0; i < 10; i++){
        this.myEnemyBoard[i] = [];
          for (var j = 0; j < 10; j++){
              this.myEnemyBoard[i][j] = 0;
      }}
      for (var i = 1; i < 11; i++){
        this.boardTable[i]=[];
            for (var j = 0; j < 11; j++){
              if(j==0)
                this.boardTable[i][j]=''+i;
              else  
                this.boardTable[i][j]='';
        }
      }
  }

  ngOnInit() {
    this.notifier.notify( "success", "Start!" );
    this.socket.on("myBoard", data => {
      this.myBoard = data;
      this.refreshBoard(this.myBoard, "my");
    });
    this.socket.on("enemyBoard", data => {
      this.realEnemyBoard = data;
    });
    this.socket.on("isTurn", data => {
      this.isTurn = data;
      this.changeTurn();
    });
    this.socket.emit("getBoards", this.playerId, this.currentRoom);
  }

  ngAfterViewInit(){
    this.socket.on("renewBoard", board=>{
        this.myBoard = board;
        this.refreshBoard(this.myBoard, "my");
    });

    this.socket.on("turn", room=>{
      if (this.currentRoom == room){
        this.isTurn = !this.isTurn;
        this.changeTurn();
      }
    })

    this.socket.on("win", (id, score)=>{
      this.gameStatus = 'win';
      this.notifier.notify( "success", "You win!" );
    });
    this.socket.on("lose", ()=>{
      this.gameStatus = 'lose';
      this.notifier.notify( "error", "You lose!" );
      for(let i=0; i<10; i++){
        for(let j=0; j<10; j++){
          if(this.realEnemyBoard[i][j]==1){
            this.myEnemyBoard[i][j]=1;
            let id = "en" +(i+1)+"_"+(j+1);
            document.getElementById(id).style.cssText = "background-color: #4b4b4b95;";
          }
        }
      }
    });
  }

  changeTurn(){
    if(this.isTurn)
      this.gameStatus = 'play'
    else
      this.gameStatus = 'wait'
  }

  refreshBoard(board: number[][], name): void{
    //●;
    for(let i=0; i<10; i++){
      for(let j = 0; j<10; j++){
        let id = name +(i+1)+"_"+(j+1);
        switch(board[i][j]){
          case (1):
              document.getElementById(id).style.cssText = "background-color: #4b4b4b95;";
            break;
          case (3):
            if(document.getElementById(id).textContent ==""){
              document.getElementById(id).style.cssText = "font-size: 1.1rem; line-height: 0.3em; color: #0c74eb; ";
              document.getElementById(id).innerHTML += '●';
            }
              break;
          case (4):
              document.getElementById(id).style.cssText = "background-color: #ffbb0095;";
              break;
          case (5):
              document.getElementById(id).style.cssText = "background-color: #ff181895;";
              break;        
        }
      }
    }
  }

  aimOn(i, j): void{
    if(i>0 && j>0){
      if(this.myEnemyBoard[i-1][j-1]==0){
        let id = "en" +(i)+"_"+(j);
        document.getElementById(id).style.cssText = "background-color: #0c74eb50;";
      }
    }
  }

  aimOut(i, j): void{
    if(i>0 && j>0){
      if(this.myEnemyBoard[i-1][j-1]==0){
        let id = "en" +(i)+"_"+(j);
        document.getElementById(id).style.cssText = "background-color: #0c74eb0;";
      }
    }
  }

  move(iBase, jBase): void{
    if(iBase>0 && jBase>0){
      let i = iBase-1;
      let j = jBase-1;
      if(this.isTurn && this.myEnemyBoard[i][j]==0){
        let id = "en" +(i+1)+"_"+(j+1);
        if(this.realEnemyBoard[i][j]==1){
          let check = this.killChack(i, j);
          if(!check){
            this.realEnemyBoard[i][j]=5;
            this.myEnemyBoard[i][j]=5;
            document.getElementById(id).style.cssText = "background-color: #1eff0095;";
          }
          else{
            this.realEnemyBoard[i][j]=4;
            this.myEnemyBoard[i][j]=4;
            document.getElementById(id).style.cssText = "background-color: #ffbb0095;";
          }
          this.socket.emit("goodShot", this.currentRoom, this.playerId, this.realEnemyBoard);
        }
        else{
          if(this.realEnemyBoard[i][j]<3){
            this.realEnemyBoard[i][j]=3;
            this.myEnemyBoard[i][j]=3;
            document.getElementById(id).style.cssText = "font-size: 1.1rem; line-height: 0.4em; color: #0c74eb; ";
            document.getElementById(id).innerHTML += '●';
            this.socket.emit("missShot", this.currentRoom, this.playerId, this.realEnemyBoard);
            this.socket.emit("changeTurn", this.currentRoom);
          }
        }
      }
    }
  }

  killChack(i, j): boolean{
    // this.notifier.notify( "warning", "killChack" );
    
      let map = new Map<number, number>();
      let chackBoard: number[][] = new Array();
      chackBoard = this.copyBoard(this.realEnemyBoard);
      map = this.serch(map, i, j, chackBoard);
      // if(map.has(1)){
      //   var mapIter = map.keys();
        
      // }Array.from(rooms[room].players.values())
      if(!map.has(1)){
        this.ship.forEach(e => {
          this.realEnemyBoard[e[1]][e[0]]=5;
          let id = "en" +(e[1]+1)+"_"+(e[0]+1);
          document.getElementById(id).style.cssText = "background-color: #1eff0095;";
        });

      }
      else{
        this.ship.clear();
      }
      return map.has(1);
  }

  serch(map: Map<number, number>, i, j, arr:number[][]): Map<number, number>{
    arr[i][j] = 0;
    for(let x=j-1; x<=j+1; x++){
      if(x>=0 && x<10)
      for(let y=i-1; y<=i+1; y++){
        if(y>=0 && y<10){
          if(arr[y][x] != 0 && arr[y][x] != 2 && arr[y][x] != 3){
            // if(arr[y][x]==1){
            //   map.set(arr[y][x], 1)
            //   return map;
            // }
            // else{
              this.ship.set(x+"_"+y, [x, y])
              map.set(arr[y][x], 1)
              map = this.serch(map, y, x, arr);
            // }
          }
        }
      }
    }
    return map;
  }

  copyBoard(arr:number[][]): number[][]{
    let newArrey: number[][] = new Array();
    for(let i=0; i<arr.length; i++){
      newArrey[i]=[];
      for(let j=0; j<arr[i].length; j++){
        newArrey[i][j]=arr[i][j];
      }
    }
    return newArrey;
  }
}
