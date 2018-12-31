import { Component, OnInit } from '@angular/core';
import { HnDateService } from '../services/hn-date.service';

@Component({
  selector: 'app-day-of-week',
  templateUrl: './day-of-week.component.html',
  styleUrls: ['./day-of-week.component.css']
})
export class DayOfWeekComponent implements OnInit {

  today: number = Date.now();

  totalSpentForWeek = 500;
  dayOfWeek: number;
  spentPerDay: number;

  constructor(private hnDateService: HnDateService) { }

  ngOnInit() {
    this.dayOfWeek = new Date().getDay() + 1;
    this.spentPerDay = this.totalSpentForWeek / this.dayOfWeek;
  }

}
