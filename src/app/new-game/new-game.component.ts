import { Component} from '@angular/core';
import {HomePageService} from '../home-page.service';
import { NotifierService } from 'angular-notifier';
import { Point } from '../point';
@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})
export class NewGameComponent{
  tableName = "tableName";
  isReady=false;
  myBoard: number[][] = new Array();
  shipToMove = -10;
  ships: number[]= [4, 3, 2, 1];
  isVerticalMode = false;
  shipsTable = [[0,1,2,3], [0,1,2], [0,1], [0]];
  boardTable = [['','a','b','c','d','e','f','g','h','i','j']]
  putedShip = new Map();
  myFieldStyles =  new Map();
  isShipTaked: boolean[] = [false, false, false, false];
  constructor(private notifier: NotifierService,  private homePageService: HomePageService) { 
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

    this.myFieldStyles.set(0, "default_element");
    this.myFieldStyles.set(1, "pased_ship");
    this.myFieldStyles.set(2, "default_element");
    this.myFieldStyles.set(3, "taked_ship");
    this.myFieldStyles.set(4, "damage_ship");
    this.myFieldStyles.set(5, "dead_ship");
  }

  ngAfterViewInit(){
    this.homePageService.waitOpponent().subscribe((data) => {
      this.isReady = true;
      this.notifier.notify( "info", "Waiting for the second player..." );
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
      this.isShipTaked[j]=false;
      // document.getElementById(id).style.cssText = "background-color: #0c74eb0;"; 
    }  
    id = "ship"+i;
    this.isShipTaked[i]=true;
      // document.getElementById(id).style.cssText = "background-color: #0c74eb70;"; 
  }

  putShip(point: Point): void{
    if(this.putToMyBoard(point.x, point.y)){
      // let id;
      --this.ships[this.shipToMove-1];
      if(this.ships[this.shipToMove-1]==0){
        this.isShipTaked[4-this.shipToMove]=false;
        // id = "ship"+(4-this.shipToMove);
        // document.getElementById(id).style.cssText = "background-color: #0c74eb0;"; 
        this.shipToMove = -10;
      }
    }
  }

  putToMyBoard(iBase, jBase): boolean{

    let checkMap = new Map();
    let chackBoard = [];
    this.putedShip.clear();

    for (let i = 0; i < this.myBoard.length; i++)
    chackBoard[i] = this.myBoard[i].slice();
    
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
        // field[point.x][point.y]=4;
        // board[point.x][point.y]=4;
    }
    // hitedShip.clear();

    // this.myBoard = this.copyBoard(testBord);
    
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
    let i = point.x;
    let j = point.y;
    if(this.shipToMove!=-10){
      let id;
      if(this.isVerticalMode){
        for(let n = 0; n < this.shipToMove; n++){
          let x = n;
          if((i+n)>=10){
            x = 9-(i+n);
          }
          if(this.myBoard[i+x][j]!=1){
            this.myBoard[i+x][j] = 3;
          }
        }
      }
      else{
        for(let n = 0; n < this.shipToMove; n++){
          let x = n;
          if((j+n)>=10){
            x = 9-(j+n);
          }
          if(this.myBoard[i][j+x]!=1){
            this.myBoard[i][j+x] = 3; 
          }
        }
      }
    }
  }

  flewAway(point: Point): void{
    if(this.shipToMove!=-10){
      for(let i=0; i<10; i++){
        for(let j=0; j<10; j++){
          if(this.myBoard[i][j]!=1){
            this.myBoard[i][j] = 0;
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
        this.homePageService.startGame(this.myBoard);
      }
      else{
        this.notifier.notify( "warning", "Some ships is unused!" );
      }
    }
  }
}
