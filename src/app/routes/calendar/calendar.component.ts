import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CalendarService } from './services/calendar.service';
import { CalendarNewExpenseComponent } from './calendar-new-expense/calendar-new-expense.component';
import {
    CalendarEvent, CalendarMonthViewDay,
    CalendarEventTimesChangedEvent, CalendarMonthViewBeforeRenderEvent,
    CalendarWeekViewBeforeRenderEvent, CalendarDayViewBeforeRenderEvent, CalendarView
} from 'angular-calendar';
import { Subject } from 'rxjs';
import { isSameDay, isSameMonth } from 'date-fns';
import moment from 'moment-timezone';
import { ViewPeriod } from 'calendar-utils';
import RRule from 'rrule';
import { ExpenseEvent } from './expense-event';
moment.tz.setDefault('Utc');

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

    test = {
        feq: RRule.WEEKLY
    };
    view = CalendarView.Month;
    viewDate = moment().toDate();
    viewPeriod: ViewPeriod;
    events: ExpenseEvent[] = [];
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
        console.log('feq ' + this.test.feq);
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

    /**
     * Drag and Drop Event - fn will handle adjustments
     * @param param0: CalendarEventTimesChangedEvent
     */
    eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.refresh.next();
    }

    /**
     * Handles the click event of a day on the calendar
     * @param param0: {Date, CalendarEvent}
     */
    dayClicked({ date, events }: { date: Date; events: any[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            this.viewDate = date;
            if (events.length > 0) {
                this.activeDayIsOpen = true;
            } else if (isSameDay(this.viewDate, date) && events.length > 0) {
                this.activeDayIsOpen = !this.activeDayIsOpen;
            } else {
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


    updateCalendarEvents(viewRender: CalendarMonthViewBeforeRenderEvent | CalendarWeekViewBeforeRenderEvent
        | CalendarDayViewBeforeRenderEvent): void {
        // if (
        //     !this.viewPeriod ||
        //     !moment(this.viewPeriod.start).isSame(viewRender.period.start) ||
        //     !moment(this.viewPeriod.end).isSame(viewRender.period.end)
        // ) {
            this.viewPeriod = viewRender.period;
            // this.calendarEvents = [];
            console.log('events dir:');
            console.dir(this.events);
            // this.events.forEach(event => {
            //     console.log('events.forEach');
            //     console.log(event.rrule);
            //     const rule = new RRule({
            //         ...event.rrule,
            //         dtstart: moment(viewRender.period.start).startOf('day').toDate(),
            //         until: moment(viewRender.period.end).endOf('day').toDate()
            //     });
            //     console.dir(rule);
            //     // rule.all().forEach(date => {
            //         // this.events.push(event);
            //         // });
            //     // console.log(rule.all());
            // });
            // console.dir(this.events);
            // this.cdr.detectChanges();
        // }
    }
}



