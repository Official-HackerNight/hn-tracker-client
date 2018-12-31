import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearToDateComponent } from './year-to-date.component';

describe('YearToDateComponent', () => {
  let component: YearToDateComponent;
  let fixture: ComponentFixture<YearToDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearToDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearToDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
