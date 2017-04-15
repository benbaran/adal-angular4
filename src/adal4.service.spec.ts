import { TestBed, inject } from '@angular/core/testing';

import { Adal4Service } from './adal4.service';

describe('Adal4Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Adal4Service]
    });
  });

  it('should ...', inject([Adal4Service], (service: Adal4Service) => {
    expect(service).toBeTruthy();
  }));
});
