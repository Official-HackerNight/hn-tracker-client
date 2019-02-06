import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CalendarService } from './services/calendar.service';
import { CalendarNewExpenseComponent } from './calendar-new-expense/calendar-new-expense.component';
import { CalendarEvent, CalendarMonthViewDay, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { isSameDay, isSameMonth } from 'date-fns';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

    view = 'month';
    viewDate: Date = new Date();
    events: CalendarEvent[] = [];
    refresh: Subject<any> = new Subject();
    newExpense = [];
    dateToday = Date.now();
    activeDayIsOpen = false;

    /**
     * Configuration Object passed
     *  into New Expense Modal
     */
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
        data: {}
    };

    constructor(private calendarService: CalendarService,
        public dialog: MatDialog) { }

    ngOnInit() {
        this.calendarService.fetchCalendarEvents()
            .subscribe(data => {
                console.log(data);
                this.events = this.calendarService.formatCalendarEvents(data);
            });
    }

    /**
     * Opens New Expense Modal
     *  once closed, new expense will be added
     *  to the events[]
     */
    openDialog(): void {
        const dialogRef = this.dialog.open(CalendarNewExpenseComponent, this.config);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.newExpense.push(result);
                this.events.push(this.calendarService.formatCalendarEvents(this.newExpense)[0]);
                this.newExpense = [];
                this.refreshView();
            }
        });
    }

    /**
     * Refresh/Update Calendar View
     */
    refreshView(): void {
        this.refresh.next();
    }

    eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.refresh.next();
    }

    /**
     * Handles the click event of a day on the calendar
     * @param param0: CalendarEvent
     */
    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            this.viewDate = date;
            if (events.length > 0) {
                this.activeDayIsOpen = true;
            } else if (isSameDay(this.viewDate, date) && events.length > 0) {
                this.activeDayIsOpen = !this.activeDayIsOpen;
            }  else {
                this.activeDayIsOpen = false;
            }
        }
    }
    /**
     * Colored the Calendar Squares prior
     *  to loading events
     * @param param0: body of calendar
     */
    beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
        // body.forEach(day => {
        //     if (day.date.getDate() % 2 === 1) {
        //         day.cssClass = this.cssClass;
        //     }
        // });
    }
}



