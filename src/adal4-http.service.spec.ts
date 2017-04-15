import { TestBed, inject } from '@angular/core/testing';

import { Adal4HTTPService } from './adal4-http.service';

describe('Adal4HTTPService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Adal4HTTPService]
    });
  });

  it('should ...', inject([Adal4HTTPService], (service: Adal4HTTPService) => {
    expect(service).toBeTruthy();
  }));
});
