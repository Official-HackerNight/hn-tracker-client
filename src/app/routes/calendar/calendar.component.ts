import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog} from '@angular/material';
import { CalendarService } from './services/calendar.service';
import { CalendarNewExpenseComponent } from './calendar-new-expense/calendar-new-expense.component';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
    test;
    events: any[];
    options: any;
    dateToday = Date.now();

    config = {
        disableClose: false,
        panelClass: 'new-expense-modal',
        hasBackdrop: true,
        backdropClass: '',
        width: '500px',
        height: '',
        minWidth: '',
        minHeight: '',
        maxWidth: '100%',
        maxHeight: '',
        position: {
          top: '',
          bottom: '',
          left: '',
          right: ''
        },
        data: {
          message: 'Jazzy jazz jazz'
        }
      };

    constructor(private calendarService: CalendarService,
        public dialog: MatDialog) { }

    ngOnInit() {
        this.calendarService.fetchCalendarEvents()
            .subscribe(data => {
                console.log(data);
                this.events = this.calendarService.formatCalendarEvents(data);
            });

        this.options = {
            defaultDate: this.dateToday,
            header: {
                right: 'today,prev,next',
                center: 'title',
                left: 'month,agendaWeek,agendaDay'
            },
        };
    }


    openDialog(): void {
        const dialogRef = this.dialog.open(CalendarNewExpenseComponent, this.config);

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.test = result;
        });
    }

}



