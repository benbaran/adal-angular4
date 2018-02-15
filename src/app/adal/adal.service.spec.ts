import { TestBed, inject } from '@angular/core/testing';

import { AdalService } from './adal.service';

describe('AdalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdalService]
    });
  });

  it('should be created', inject([AdalService], (service: AdalService) => {
    expect(service).toBeTruthy();
  }));
});
