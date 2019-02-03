import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarNewExpenseComponent } from './calendar-new-expense.component';

describe('CalendarNewExpenseComponent', () => {
  let component: CalendarNewExpenseComponent;
  let fixture: ComponentFixture<CalendarNewExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarNewExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarNewExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
