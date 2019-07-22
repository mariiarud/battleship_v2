import { Component} from '@angular/core';
import {BattleshipService} from '../../services/battleship.service';
import { NotifierService } from 'angular-notifier';
import { Point } from '../../point';
@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})
export class NewGameComponent{
  tableName = "tableName";

  isReady=false;
  myBoard: number[][] = new Array();
  shipsTable = [[0,1,2,3], [0,1,2], [0,1], [0]];
  ships: number[]= [4, 3, 2, 1];
  shipToMove = -10;
  
  isShipTaked: boolean[] = [false, false, false, false];
  isVerticalMode = false;

  putedShip = new Map();
  myFieldStyles =  new Map();

  constructor(private notifier: NotifierService,  private battleshipService: BattleshipService) { 
    this.notifier = notifier;

    for (var i = 0; i < 10; i++){
      this.myBoard[i] = [];
          for (var j = 0; j < 10; j++){
              this.myBoard[i][j] = 0;
      }}

    this.myFieldStyles.set(0, "default_element");
    this.myFieldStyles.set(1, "alive_ship");
    this.myFieldStyles.set(2, "default_element");
    this.myFieldStyles.set(3, "taked_ship");
  }

  ngAfterViewInit(){
    this.battleshipService.waitOpponent().subscribe(() => {
      this.isReady = true;
      this.notifier.notify( "info", "Waiting for the second player..." );
    });
  }

  takeShip(i): void{
    this.shipToMove = 4 - i;
    if( this.ships[this.shipToMove-1]==0){
      this.notifier.notify( "warning", "No ships left!" );
      this.shipToMove = -10;
    }
    else{
        for(let j = 0; j<4; j++){
          this.isShipTaked[j]=false;
        }  
        this.isShipTaked[i]=true;
    }
  }

  turnShip(){
    this.isVerticalMode = !this.isVerticalMode;
  }

  putShip(point: Point): void{
    if(this.tryToPut(point.x, point.y)){
      --this.ships[this.shipToMove-1];
      if(this.ships[this.shipToMove-1]==0){
        this.isShipTaked[4-this.shipToMove]=false;
        this.shipToMove = -10;
      }
    }
  }

  tryToPut(iBase, jBase): boolean{
    let checkMap = new Map();
    let chackBoard = this.copyBoard(this.myBoard);
    this.putedShip.clear();
    checkMap = this.searchShipsNearBy(checkMap, iBase, jBase, chackBoard);

    if(!checkMap.has(1)&&!checkMap.has(2)){
      this.putedShip.forEach(e => {
        this.myBoard[e[1]][e[0]]=1;
      });
      this.myBoard[iBase][jBase]=1;
      return true;
    }
    else{
      this.notifier.notify( "warning", "Cannot be placed here!" );
      return false;
    }
  }

  searchShipsNearBy(checkMap, i, j, chackBoard){
    chackBoard[i][j] = 0;
    for(let x=j-1; x<=j+1; x++){
      if(x>=0 && x<10)
      for(let y=i-1; y<=i+1; y++){
        if(y>=0 && y<10){
          checkMap.set(chackBoard[y][x], chackBoard[y][x])
          if(chackBoard[y][x] == 3){
            this.putedShip.set(x+"_"+y, [x, y])
            checkMap = this.searchShipsNearBy(checkMap, y, x, chackBoard);
          }
        }
      }
    }
    return checkMap;
  }

  shipInAir(point: Point): void{
    if(this.shipToMove!=-10){
      if(this.isVerticalMode){
        this.showShipVertical(point)
      }
      else{
        this.showShipHorisontal(point)
      }
    }
  }

  showShipHorisontal(point){
    for(let n = 0; n < this.shipToMove; n++){
      let x = n;
      if((point.y+n)>=10){
        x = 9-(point.y+n);
      }
      if(this.myBoard[point.x][point.y+x]!=1){
        this.myBoard[point.x][point.y+x] = 3; 
      }
    }
  }

  showShipVertical(point){
    for(let n = 0; n < this.shipToMove; n++){
      let x = n;
      if((point.x+n)>=10){
        x = 9-(point.x+n);
      }
      if(this.myBoard[point.x+x][point.y]!=1){
        this.myBoard[point.x+x][point.y] = 3;
      }
    }
  }

  flewAway(): void{
    for(let i=0; i<10; i++){
      for(let j=0; j<10; j++){
        if(this.myBoard[i][j]!=1){
          this.myBoard[i][j] = 0;
        }
      }
    }
  }

  eraser(): void{
    if(!this.isReady){
      for (var i = 0; i < 10; i++){
            for (var j = 0; j < 10; j++){
              this.myBoard[i][j] = 0;
        }
      }
      this.ships = [4, 3, 2, 1];
      this.shipToMove = -10;
    }
  }

  copyBoard(board:number[][]): number[][]{
    let newBoard: number[][] = new Array();
    for (let i = 0; i < board.length; i++)
      newBoard[i] = board[i].slice();
    return newBoard;
  }

  startGame(){
    if(!this.isReady){
      if(this.isAllShipsUsed()){
        this.battleshipService.startGame(this.myBoard);
      }
      else{
        this.notifier.notify( "warning", "Some ships is unused!" );
      }
    }
  }
  
  isAllShipsUsed(){
    let check = true;
      for( let i=0; i<4; i++){
        if (this.ships[i]!=0){
          check = false;
          break;
        }
      }
    return check;
  }
}
