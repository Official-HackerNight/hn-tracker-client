import { TestBed } from '@angular/core/testing';

import { RruleService } from './rrule.service';

describe('RruleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RruleService = TestBed.get(RruleService);
    expect(service).toBeTruthy();
  });
});
