import { Component, Input, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { Point } from '../point';
import {OnGameService} from '../on-game.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-on-game',
  templateUrl: './on-game.component.html',
  styleUrls: ['./on-game.component.css']
})
export class OnGameComponent implements OnInit {
  @Input() socket: any;
  @Input() playerId: string;
  @Input() currentRoom: string;

  myField: number[][] = new Array();
  myBoard: number[][] = new Array();
  enemyField: number[][] = new Array();

  myFieldStyles =  new Map();
  enemyFieldStyles = new Map();

  isTurn: boolean = false;
  gameStatus = 'wait';
  onGameService : OnGameService;

  constructor(private notifier: NotifierService) { 

      for (var i = 0; i < 10; i++){
        this.enemyField[i] = [];
          for (var j = 0; j < 10; j++){
              this.enemyField[i][j] = 0;
      }}

    this.myFieldStyles.set(0, "default_element");
    this.myFieldStyles.set(1, "intact_ship");
    this.myFieldStyles.set(2, "default_element");
    this.myFieldStyles.set(3, "miss_shot");
    this.myFieldStyles.set(4, "damage_ship");
    this.myFieldStyles.set(5, "dead_ship");

    this.enemyFieldStyles.set(0, "enemy_element");
    this.enemyFieldStyles.set(1, "alive_ship");
    this.enemyFieldStyles.set(2, "enemy_element");
    this.enemyFieldStyles.set(3, "miss_shot");
    this.enemyFieldStyles.set(4, "damage_ship");
    this.enemyFieldStyles.set(5, "dead_ship");
  }

  ngOnInit() {
    this.onGameService = new OnGameService(this.socket);
    this.onGameService.getBoards(this.playerId, this.currentRoom);

    this.onGameService.getMyBoard().subscribe((data) => {
      this.myField = data;
    });

    this.onGameService.getTurn().subscribe((data) => {
      this.isTurn = data;
      this.changeTurn();
    });
  }

  ngAfterViewInit(){
    this.onGameService.getEnemyField().subscribe((data) => {
      this.enemyField = data;
    });

    this.onGameService.getMyField().subscribe((data) => {
      this.updateMyField(data);
    });

    this.onGameService.changeTurn().subscribe(() => {
      this.isTurn = !this.isTurn;
      this.changeTurn();
    });

    this.onGameService.onWin().subscribe(() => {
      this.gameStatus = 'win';
      this.notifier.notify( "success", "You win!" );
    });

    this.onGameService.onLose().subscribe((data) => {
      this.gameStatus = 'lose';
      this.updateEnemyField(data);
      this.notifier.notify( "error", "You lose!" );
    });
  }

  shot(point: Point){
    if(this.isTurn && this.enemyField[point.x][point.y]==0)
    this.onGameService.shot(this.currentRoom, this.playerId, this.enemyField, point);
  }

  changeTurn(){
    if(this.isTurn)
      this.gameStatus = 'play'
    else
      this.gameStatus = 'wait'
  }

  updateMyField(field:number[][]){
    for(let i=0; i<field.length; i++){
      for(let j=0; j<field[i].length; j++){
        if(field[i][j]!=0)
          this.myField[i][j]=field[i][j];
      }
    }
  }

  updateEnemyField(field:number[][]){
    for(let i=0; i<field.length; i++){
      for(let j=0; j<field[i].length; j++){
        if(field[i][j]==1)
          this.enemyField[i][j]=1;
      }
    }
  }
}
