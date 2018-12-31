import { Component, OnInit } from '@angular/core';
import { HnDateService } from '../services/hn-date.service';

@Component({
  selector: 'app-day-of-month',
  templateUrl: './day-of-month.component.html',
  styleUrls: ['./day-of-month.component.css']
})
export class DayOfMonthComponent implements OnInit {
  today: number = Date.now();

  dayOfMonth: number;
  totalSpentForMonth = 3000;
  spentPerDay: number;
  constructor(private hnDateService: HnDateService) { }

  ngOnInit() {
    this.dayOfMonth = new Date().getDate();
    this.spentPerDay = this.totalSpentForMonth / this.dayOfMonth;
  }

}
