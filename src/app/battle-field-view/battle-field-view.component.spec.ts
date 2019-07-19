import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleFieldViewComponent } from './battle-field-view.component';

describe('BattleFieldViewComponent', () => {
  let component: BattleFieldViewComponent;
  let fixture: ComponentFixture<BattleFieldViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleFieldViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleFieldViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
