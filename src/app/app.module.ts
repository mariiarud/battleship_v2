import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {Routes, RouterModule} from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';    
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { NewGameComponent } from './new-game/new-game.component';
import { OnGameComponent } from './on-game/on-game.component';
import { EnemyBoardComponent } from './enemy-board/enemy-board.component';
import { BattleFieldViewComponent } from './battle-field-view/battle-field-view.component';
import { RoomsComponent } from './rooms/rooms.component';
import {HomePageService} from './home-page.service';

const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'left',
			distance: 12
		},
		vertical: {
			position: 'bottom',
			distance: 12,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 1500,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

const appRoutes: Routes =[
  { path: 'home', component: RoomsComponent},
  { path: 'new_game', component: NewGameComponent},
  { path: 'on_game', component: OnGameComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NewGameComponent,
    OnGameComponent,
    EnemyBoardComponent,
    BattleFieldViewComponent,
    RoomsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    BrowserAnimationsModule,  
    RouterModule.forRoot(appRoutes),
    NotifierModule.withConfig(customNotifierOptions)
  ],
  providers: [HomePageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
