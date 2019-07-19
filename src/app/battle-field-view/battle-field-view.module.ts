import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BattleFieldViewComponent } from './battle-field-view.component';

@NgModule({
  declarations: [BattleFieldViewComponent],
  imports: [
    CommonModule
  ],
  exports:[BattleFieldViewComponent]
})
export class BattleFieldViewModule { }
