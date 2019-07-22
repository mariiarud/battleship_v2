import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Point } from '../../point';

@Component({
  selector: 'app-battle-field-view',
  templateUrl: './battle-field-view.component.html',
  styleUrls: ['./battle-field-view.component.css']
})
export class BattleFieldViewComponent{
  @Input() field: number[][];
  @Input() styles;

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

  getStyle(i, j) {
    if(i<1 || j<1 || this.field.length<1)
      return "default_element";
    else
      return this.styles.get(this.field[i-1][j-1]);
  }

  @Output() onCellClick = new EventEmitter<Point>();
  cellChick(i , j) {
      if(i>0 && j>0){
        let point = new Point(i-1, j-1);
        this.onCellClick.emit(point);
      }
  }

  @Output() onCellMouseOver = new EventEmitter<Point>();
  shipInAir(i , j) {
      if(i>0 && j>0){
        let point = new Point(i-1, j-1);
        this.onCellMouseOver.emit(point);
      }
  }
  
  @Output() onCellMouseLeave = new EventEmitter<Point>();
  flewAway(i , j) {
      if(i>0 && j>0){
        this.onCellMouseLeave.emit();
      }
  }
}
