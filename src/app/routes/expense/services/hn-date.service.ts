import { Injectable, OnInit } from '@angular/core';

@Injectable()
export class HnDateService implements OnInit {

  dayOfTheYear: number;

  constructor() { }

  ngOnInit(): void {
    this.dayOfTheYear = this.setDayOfTheYear();
  }

  setDayOfTheYear(): number {
    // ad hoc for the moment should be replaced 1/27/2018
    // test that the date updates per user and automatically after 24hours
    const now: any = new Date();
    const start: any = new Date(now.getFullYear(), 0, 0);
    const  diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return day;
  }
}
