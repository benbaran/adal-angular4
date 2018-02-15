import { TestBed, async, inject } from '@angular/core/testing';

import { AdalGuard } from './adal.guard';

describe('AdalGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdalGuard]
    });
  });

  it('should ...', inject([AdalGuard], (guard: AdalGuard) => {
    expect(guard).toBeTruthy();
  }));
});
