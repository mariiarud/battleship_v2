import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewGameComponent } from './components/new-game/new-game.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { OnGameComponent } from './components/on-game/on-game.component';
// const routes: Routes = [];

const routes: Routes = [
  { path: 'home', component: RoomsComponent},
  { path: 'new_game', component: NewGameComponent},
  { path: 'on_game', component: OnGameComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
