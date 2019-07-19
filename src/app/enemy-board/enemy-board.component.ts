import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-enemy-board',
  templateUrl: './enemy-board.component.html',
  styleUrls: ['./enemy-board.component.css']
})
export class EnemyBoardComponent{
  // @Input() tableName: string;

  @Input() myEnemyBoard: number[][] = new Array();

  boardTable = [['','a','b','c','d','e','f','g','h','i','j']];

  constructor() {
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

  @Output() onChanged = new EventEmitter<number[]>();
  move(coordinates:number[]) {
      this.onChanged.emit(coordinates);
  }
}
