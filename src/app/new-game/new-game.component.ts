import { Component, Input, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})
export class NewGameComponent implements OnInit {
  private notifier: NotifierService;
  @Input() socket: any;
  @Input() playerId: string;
  @Input() currentRoom: string;
  isReady=false;
  myBoard: number[][] = new Array();
  shipToMove = -10;
  ships: number[]= [4, 3, 2, 1];
  isVerticalMode = false;
  shipsTable = [[0,1,2,3], [0,1,2], [0,1], [0]];
  boardTable = [['','a','b','c','d','e','f','g','h','i','j']]

  constructor(notifier: NotifierService) { 
    this.notifier = notifier;
    for (var i = 0; i < 10; i++){
      this.myBoard[i] = [];
          for (var j = 0; j < 10; j++){
              this.myBoard[i][j] = 0;
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

  }

  ngAfterViewInit(){
    this.socket.on("waiting", () =>{
      this.isReady = true;
      this.notifier.notify( "info", "Waiting for the second player..." );
      document.getElementById('eraser').style.cssText = "background-color: #ff181870;"; 
    });
  }

  takeShip(i): void{
    this.shipToMove =4 - i;
    if( this.ships[this.shipToMove-1]==0){
      this.notifier.notify( "warning", "No ships left!" );
      this.shipToMove = -10;
      return;
    }
    let id;
    for(let j = 0; j<4; j++){
      id = "ship"+j;
      document.getElementById(id).style.cssText = "background-color: #0c74eb0;"; 
    }  
    id = "ship"+i;
      document.getElementById(id).style.cssText = "background-color: #0c74eb70;"; 
  }

  putShip(i, j): void{
    if(i!=0 && j!=0){
      if(this.putToBorder(i-1, j-1)){
        let id;
        if(this.isVerticalMode){
          for(let n = 0; n < this.shipToMove; n++){
          ///////////////
            let k = n;
          //////////////
            if((i+n)>=11){
              k = 10-(i+n);
            }
            id = "el"+(i+k)+"_"+j;
            document.getElementById(id).style.cssText = "background-color: #4b4b4b95;  border: 3px solid #4d4d4d;"; 
          }
        }
        else{
          for(let n = 0; n < this.shipToMove; n++){
            ///////////////
              let k = n;
            //////////////
              if((j+n)>=11){
                k = 10-(j+n);
              }
              id = "el"+i+"_"+(j+k);
              document.getElementById(id).style.cssText = "background-color: #4b4b4b95;  border: 3px solid #4d4d4d;"; 
          }
        }
        this.ships[this.shipToMove-1]--;
        if(this.ships[this.shipToMove-1]==0){
          id = "ship"+(4-this.shipToMove);
          document.getElementById(id).style.cssText = "background-color: #0c74eb0;"; 
          this.shipToMove = -10;
        }
      }
    }
  }

  putToBorder(iBase, jBase): boolean{
    let testBord: number[][] = this.copyBoard(this.myBoard);
    let i = iBase;
    let j = jBase;
    if(this.isVerticalMode){
      if(i+this.shipToMove-1>=10){
        i += 9-(i+this.shipToMove-1);
      }
      for(let y=i-1; y<=i+this.shipToMove; y++){
        if(y>=0 && y<10){
          for(let x=j-1; x<=j+1; x++){
            if(x>=0 && x<10){
              if(y>=i && y<i+this.shipToMove && x==j){
                if(testBord[y][x]!=0){
                  this.notifier.notify( "warning", "Cannot be placed here!" );
                  return false;
                }
                testBord[y][x]=1;
              }
              else testBord[y][x]=2;
            }
          }
        }
      }
    }
    else
    {
      if(j+this.shipToMove-1>=10){
        j += 9-(j+this.shipToMove-1);
      }
      for(let x=j-1; x<=j+this.shipToMove; x++){
        if(x>=0 && x<10){
          for(let y=i-1; y<=i+1; y++){
            if(y>=0 && y<10){
              if(x>=j && x<j+this.shipToMove && y==i){
                if(testBord[y][x]!=0){
                  this.notifier.notify( "warning", "Cannot be placed here!" );
                  return false;
                }
                testBord[y][x]=1;
              }
              else testBord[y][x]=2;
            }
          }
        }
      }
    }
    this.myBoard = this.copyBoard(testBord);
    return true;
  }

  shipInAir(i, j): void{
    if(this.shipToMove!=-10 && i!=0 && j!=0){
      let id;
      if(this.isVerticalMode){
        for(let n = 0; n < this.shipToMove; n++){
          let x = n;
          if((i+n)>=11){
            x = 10-(i+n);
          }
          if(this.myBoard[i+x-1][j-1]!=1){
            id = "el"+(i+x)+"_"+j;
          document.getElementById(id).style.cssText = "background-color: #0c74eb70;"; 
          }
        }
      }
      else{
        for(let n = 0; n < this.shipToMove; n++){
          let x = n;
          if((j+n)>=11){
            x = 10-(j+n);
          }
          if(this.myBoard[i-1][j+x-1]!=1){
            id = "el"+i+"_"+(j+x);
          document.getElementById(id).style.cssText = "background-color: #0c74eb70;"; 
          }
        }
      }
    }
  }

  flewAway(): void{
    if(this.shipToMove!=-10){
      for(let i=1; i<11; i++){
        for(let j=1; j<11; j++){
          if(this.myBoard[i-1][j-1]!=1){
            let id = "el"+i+"_"+j;
            document.getElementById(id).style.cssText = "background-color: #0c74eb0;"; 
          }
        }
      }
    }
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

  turnOver(){
    this.isVerticalMode = !this.isVerticalMode;
    if(this.isVerticalMode){
      document.getElementById("turn_over").style.cssText = "background-color: #0c74eb70; margin-right: 2em; margin-left: -1px;"; 
    }
    else{
      document.getElementById("turn_over").style.cssText = "background-color: #0c74eb0; margin-right: 2em; margin-left: -1px;"; 
    }
  }

  eraser(): void{
    if(!this.isReady){
      for (var i = 0; i < 10; i++){
            for (var j = 0; j < 10; j++){
              let id;
              id = "el"+(i+1)+"_"+(j+1);
              document.getElementById(id).style.cssText = "background-color: #0c74eb0;  border: 2.8px solid #0c74eb;"; 
              this.myBoard[i][j] = 0;
        }
      }
      this.ships = [4, 3, 2, 1];
      this.shipToMove = -10;
    }
    else{

    }
  }

  startGame(){
    
    if(!this.isReady){
      let check = true;
      for( let i=0; i<4; i++){
        if (this.ships[i]!=0){
          check = false;
          break;
        }
      }
      if(check){
        this.socket.emit("startGame", this.currentRoom, this.playerId, this.myBoard);
        document.getElementById("start").style.cssText = "background-color: #0c74eb50;"; 
      }
      else{
        this.notifier.notify( "warning", "Some ships is unused!" );
      }
    }
    else{
      this.notifier.notify( "info", "Waiting for the second player..." );
    }
  }
}
