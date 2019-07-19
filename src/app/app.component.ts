import { Component, OnInit} from '@angular/core';
import { NotifierService } from 'angular-notifier';
import {HomePageService} from './home-page.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  timeLeft: number = 2;
  title = 'Battleship';
  gameStatus = 'home';

  private notifier: NotifierService;
  
  public constructor( notifier: NotifierService, private homePageService: HomePageService ) {
		this.notifier = notifier;
	}

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

    this.homePageService.changeGameStatus().subscribe((data) => {
      this.gameStatus = data;
    });

    this.homePageService.roomIsFull().subscribe(() => {
      this.notifier.notify( "warning", "Room is occupied!" );
    });

    this.homePageService.opponentLeave().subscribe(() => {
      this.notifier.notify( "error", "Opponent left the game!" );
      let timeLeft: number = 2;
      let interval = setInterval(() => {
        if(timeLeft > 0) {
          timeLeft--;
        } else {
          this.gameStatus = "home";
          clearInterval(interval);
        }
      },1000);
    });
  }

//   joinRoom(i): void {

//     // const source$ = from([
//     //   { name: 'Brian' },
//     //   { name: 'Joe' },
//     //   { name: 'Joe' },
//     //   { name: 'Sue' }
//     // ]);
    
//     // source$
//     //   .pipe(distinctUntilChanged((prev, curr) => prev.name === curr.name), (e)=> e.name )
//     //   .subscribe(console.log);

//   //   // this.socket.emit("joinRoom", i);

//   interface Person {
//     age: number,
//     name: string
//  }
  
//  const source$ = of<Person>(
//      { age: 4, name: 'Foo'},
//      { age: 7, name: 'Bar'},
//      { age: 5, name: 'Foo'},
//      { age: 6, name: 'Foo'},
//    );

//    source$.pipe(
//      distinctUntilChanged(null, (p: Person) => p.name),
//    )
//    .subscribe(x => console.log(x));
//   }
}
