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

  private notifier: NotifierService;
  
  public constructor( notifier: NotifierService, private homePageService: HomePageService, private router: Router) {
		this.notifier = notifier;
	}

  ngOnInit(): void {
    // this.router.navigateByUrl('/home');
  }

  ngAfterViewInit(): void {
    this.homePageService.changeGameStatus().subscribe((data) => {
      this.gameStatus = data;
      this.router.navigateByUrl('/'+data);

    });

    this.notifier.show( {type: 'success',
    message: 'You are awesome! I mean it!'} );

    this.homePageService.roomIsFull().subscribe(() => {
      // this.notifier.notify( "warning", "Room is occupied!" );
    });

    this.homePageService.opponentLeave().subscribe(() => {
      let timeLeft: number = 2;
      let interval = setInterval(() => {
        if(timeLeft > 0) {
          timeLeft--;
        } else {
          this.gameStatus = "home";
          this.router.navigateByUrl('/home');
          clearInterval(interval);
        }
      },1000);
    });
    // this.notifier.notify( "error", "Opponent left the game!" );
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
