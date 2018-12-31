import { TestBed, inject } from '@angular/core/testing';

import { HnDateService } from './hn-date.service';

describe('HnDateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HnDateService]
    });
  });

  it('should be created', inject([HnDateService], (service: HnDateService) => {
    expect(service).toBeTruthy();
  }));
});
