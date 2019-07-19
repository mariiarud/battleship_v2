import { Component, OnInit} from '@angular/core';
import { NotifierService } from 'angular-notifier';
import {HomePageService} from './home-page.service';
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
  
  public constructor(private notifier: NotifierService, private homePageService: HomePageService, private router: Router) {
		this.notifier = notifier;
	}

  ngOnInit(): void {
    this.router.navigateByUrl('/home');
  }

  ngAfterViewInit(): void {
    this.homePageService.changeGameStatus().subscribe((data) => {
      this.gameStatus = data;
      this.router.navigateByUrl('/'+data);
    });

    this.homePageService.roomIsFull().subscribe(() => {
      this.notifier.notify( "warning", "Room is occupied!" );
    });

    this.homePageService.opponentLeave().subscribe(() => {
      // let timeLeft: number = 2;
      // let interval = setInterval(() => {
      //   if(timeLeft > 0) {
      //     timeLeft--;
      //   } else {
      //     this.gameStatus = "home";
      //     this.router.navigateByUrl('/home');
      //     clearInterval(interval);
      //   }
      // },1000);
      this.notifier.notify( "error", "Opponent left the game!" );
    });
  }
}
