import { TestBed, inject } from '@angular/core/testing';

import { ADAL4Service } from './adal4.service';

describe('ADAL4Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ADAL4Service]
    });
  });

  it('should ...', inject([ADAL4Service], (service: ADAL4Service) => {
    expect(service).toBeTruthy();
  }));
});
