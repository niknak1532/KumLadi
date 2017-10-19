import { TestBed, inject } from '@angular/core/testing';

import { KontrollerService } from './kontroller.service';

describe('KontrollerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KontrollerService]
    });
  });

  it('should be created', inject([KontrollerService], (service: KontrollerService) => {
    expect(service).toBeTruthy();
  }));
});
