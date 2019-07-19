import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomePageService} from '../home-page.service';
import { RoomsComponent } from './rooms.component';

@NgModule({
  declarations: [RoomsComponent],
  imports: [
    CommonModule
  ],
  exports:[RoomsComponent],
  providers: [HomePageService]
})
export class RoomsModule { }
