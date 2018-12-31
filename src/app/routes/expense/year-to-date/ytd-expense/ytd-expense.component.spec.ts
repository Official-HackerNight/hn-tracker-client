import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YtdExpenseComponent } from './ytd-expense.component';

describe('YtdExpenseComponent', () => {
  let component: YtdExpenseComponent;
  let fixture: ComponentFixture<YtdExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YtdExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YtdExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
