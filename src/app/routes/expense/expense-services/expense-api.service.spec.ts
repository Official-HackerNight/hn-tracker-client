import { TestBed, inject } from '@angular/core/testing';

import { ExpenseApiService } from './expense-api.service';

describe('ExpenseApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenseApiService]
    });
  });

  it('should be created', inject([ExpenseApiService], (service: ExpenseApiService) => {
    expect(service).toBeTruthy();
  }));
});
