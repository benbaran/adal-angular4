import { TestBed, inject } from '@angular/core/testing';

import { ADAL4HTTPService } from './adal4-http.service';

describe('ADAL4HTTPService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ADAL4HTTPService]
    });
  });

  it('should ...', inject([ADAL4HTTPService], (service: ADAL4HTTPService) => {
    expect(service).toBeTruthy();
  }));
});
