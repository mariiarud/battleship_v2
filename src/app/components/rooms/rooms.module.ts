import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BattleshipService} from '../../services/battleship.service';
import { RoomsComponent } from './rooms.component';

@NgModule({
  declarations: [RoomsComponent],
  imports: [
    CommonModule
  ],
  exports:[RoomsComponent],
  providers: [BattleshipService]
})
export class RoomsModule { }
