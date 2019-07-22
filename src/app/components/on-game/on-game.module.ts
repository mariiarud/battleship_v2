import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnGameComponent } from './on-game.component';
import { BattleFieldViewModule } from '../battle-field-view/battle-field-view.module';

import {BattleshipService} from '../../services/battleship.service';
import {OnGameService} from '../../services/on-game.service';

import { NotifierModule, NotifierOptions } from 'angular-notifier';

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
    autoHide: 5000,
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

@NgModule({
  declarations: [
    OnGameComponent],
  imports: [
    CommonModule,
    BattleFieldViewModule,
    NotifierModule.withConfig(customNotifierOptions)
  ],
  exports:[OnGameComponent],
  providers: [BattleshipService,
    OnGameService]
})
export class OnGameModule { }
