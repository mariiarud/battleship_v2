import { TestBed } from '@angular/core/testing';

import { OnGameService } from './on-game.service';

describe('OnGameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OnGameService = TestBed.get(OnGameService);
    expect(service).toBeTruthy();
  });
});
