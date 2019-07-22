import { Component, OnInit } from '@angular/core';
import { Point } from '../../point';
import { NotifierService } from 'angular-notifier';
import { BattleshipService } from '../../services/battleship.service';
import {OnGameService} from '../../services/on-game.service';

@Component({
  selector: 'app-on-game',
  templateUrl: './on-game.component.html',
  styleUrls: ['./on-game.component.css']
})
export class OnGameComponent implements OnInit {

  myField: number[][] = new Array();
  myBoard: number[][] = new Array();
  enemyField: number[][] = new Array();

  myFieldStyles =  new Map();
  enemyFieldStyles = new Map();

  isTurn: boolean = false;
  gameStatus = 'wait';

  constructor(private notifier: NotifierService, private battleshipService: BattleshipService, private onGameService: OnGameService) { 
    this.notifier = notifier;
    
      for (var i = 0; i < 10; i++){
        this.enemyField[i] = [];
          for (var j = 0; j < 10; j++){
              this.enemyField[i][j] = 0;
      }}

    this.myFieldStyles.set(0, "default_element");
    this.myFieldStyles.set(1, "alive_ship");
    this.myFieldStyles.set(2, "default_element");
    this.myFieldStyles.set(3, "miss_shot");
    this.myFieldStyles.set(4, "damage_ship");
    this.myFieldStyles.set(5, "dead_ship");

    this.enemyFieldStyles.set(0, "enemy_element");
    this.enemyFieldStyles.set(1, "alive_ship");
    this.enemyFieldStyles.set(2, "enemy_element");
    this.enemyFieldStyles.set(3, "miss_shot");
    this.enemyFieldStyles.set(4, "damage_ship");
    this.enemyFieldStyles.set(5, "killed_ship");
  }

  ngOnInit() {
    this.battleshipService.getBoards();

    this.battleshipService.getMyBoard().subscribe(data => 
      this.myField = data
    );

    this.battleshipService.getTurn().subscribe((data) => {
      this.isTurn = data;
      this.changeTurn();
    });
  }

  ngAfterViewInit(){
    this.battleshipService.getEnemyField().subscribe( data =>
      this.enemyField = data
    );

    this.battleshipService.getMyField().subscribe( data =>
      this.myField = this.onGameService.updateMyField(data, this.myField)
    );

    this.battleshipService.changeTurn().subscribe(() => {
      this.isTurn = !this.isTurn;
      this.changeTurn();
    });

    this.battleshipService.onWin().subscribe(() => {
      this.gameStatus = 'win';
      this.notifier.notify( "success", "You win!" );
    });

    this.battleshipService.onLose().subscribe((data) => {
      this.gameStatus = 'lose';
      this.enemyField = this.onGameService.updateEnemyField(data, this.enemyField);
      this.notifier.notify( "error", "You lose!" );
    });
  }

  shot(point: Point){
    if(this.isTurn && this.enemyField[point.x][point.y]==0)
    this.battleshipService.shot(this.enemyField, point);
  }

  changeTurn(){
    if(this.isTurn)
      this.gameStatus = 'play'
    else
      this.gameStatus = 'wait'
  }
}
