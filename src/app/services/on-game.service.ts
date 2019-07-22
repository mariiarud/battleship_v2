import { Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnGameService{

  
  updateMyField(field:number[][], myField:number[][]){
    for(let i=0; i<field.length; i++){
      for(let j=0; j<field[i].length; j++){
        if(field[i][j]!=0)
          myField[i][j]=field[i][j];
      }
    }
    return myField;
  }

  updateEnemyField(field:number[][], enemyField:number[][]){
    for(let i=0; i<field.length; i++){
      for(let j=0; j<field[i].length; j++){
        if(field[i][j]==1)
          enemyField[i][j]=1;
      }
    }
    return enemyField;
  }
  
}
