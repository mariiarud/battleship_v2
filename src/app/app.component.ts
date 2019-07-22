import { Component, OnInit} from '@angular/core';
import { NotifierService } from 'angular-notifier';
import {BattleshipService} from './services/battleship.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  timeLeft: number = 2;
  title = 'Battleship';
  gameStatus = 'home';
  
  public constructor(private notifier: NotifierService, private battleshipService: BattleshipService, private router: Router) {
		this.notifier = notifier;
	}

  ngOnInit(): void {
    this.router.navigateByUrl('/home');
  }

  ngAfterViewInit(): void {
    this.battleshipService.changeGameStatus().subscribe((data) => {
      this.gameStatus = data;
      this.router.navigateByUrl('/'+data);
    });

    this.battleshipService.roomIsFull().subscribe(() => {
      this.notifier.notify( "warning", "Room is occupied!" );
    });

    this.battleshipService.opponentLeave().subscribe(() => {
      this.notifier.notify( "error", "Opponent left the game! Current game stopped." );
    });
  }
}
