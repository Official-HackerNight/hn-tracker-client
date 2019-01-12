import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  events: any[];
  options: any;
  constructor() { }

  ngOnInit() {
    this.events = [
      {
          "title": "All Day Event",
          "start": "2019-01-11"
      },
      {
          "title": "Long Event",
          "start": "2019-01-12",
          "end": "2019-01-011"
      },
      {
          "title": "Repeating Event",
          "start": "2019-01-09T16:00:00",
          "editable": false
      },
      {
          "title": "Repeating Event",
          "start": "2019-01-16T16:00:00",
          "editable": true
      },
      {
          "title": "Conference",
          "start": "2019-01-11",
          "end": "2019-01-13",
          "editable": false
      }
    ];

    this.options = {
      defaultDate: '2019-01-01',
      header: {
          right: 'today,prev,next',
          center: 'title',
          left: 'month,agendaWeek,agendaDay'
      },
    };
  }
}
