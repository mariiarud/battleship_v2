import { TestBed } from '@angular/core/testing';

import { NewGameService } from './new-game.service';

describe('NewGameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewGameService = TestBed.get(NewGameService);
    expect(service).toBeTruthy();
  });
});
