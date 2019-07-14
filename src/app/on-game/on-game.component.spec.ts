import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnGameComponent } from './on-game.component';

describe('OnGameComponent', () => {
  let component: OnGameComponent;
  let fixture: ComponentFixture<OnGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
