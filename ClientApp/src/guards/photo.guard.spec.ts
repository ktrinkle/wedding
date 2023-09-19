import { TestBed } from '@angular/core/testing';

import { PhotoGuard } from './photo.guard';

describe('PhotoGuard', () => {
  let guard: PhotoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PhotoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
