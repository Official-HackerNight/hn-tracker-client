import { RruleService } from './services/rrule/rrule.service';
import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
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

    view = CalendarView.Month;
    viewDate = moment().toDate();
    viewPeriod: ViewPeriod;
    events: ExpenseEvent[] = [];
    ogEvents: ExpenseEvent[] = [];
    recurringEvents: ExpenseEvent[] = [];
    refresh: Subject<any> = new Subject();
    newExpense = [];
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
        public dialog: MatDialog, private cdr: ChangeDetectorRef, private rruleService: RruleService) { }

    ngOnInit() {
        // console.log(moment().toDate());
        this.calendarService.fetchCalendarEvents()
            .subscribe(data => {
                console.log(data);
                this.ogEvents = data;
                this.events = this.calendarService.processCalendarEvents(data);
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
                this.events.push(this.calendarService.processCalendarEvents(this.newExpense)[0]);
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
     * On a User's change of Calendar View e.g. Month January to February
     *  Adds all the recurring events for the new view
     * @param viewRender: CalendarMonthViewBeforeRenderEvent | CalendarWeekViewBeforeRenderEvent
                                | CalendarDayViewBeforeRenderEvent
     */
    updateCalendarEvents(viewRender: CalendarMonthViewBeforeRenderEvent | CalendarWeekViewBeforeRenderEvent
        | CalendarDayViewBeforeRenderEvent): void {
        console.log('updateCalendarEvents()');
        if (
            !this.viewPeriod ||
            !moment(this.viewPeriod.start).isSame(viewRender.period.start) ||
            !moment(this.viewPeriod.end).isSame(viewRender.period.end)
        ) {
            console.log('view period');
            this.viewPeriod = viewRender.period;
            console.log(this.viewPeriod.start);
            console.log(this.viewPeriod.end);
            this.events = [];
            console.log('processing ogEvents');
            console.log(this.ogEvents);
            this.ogEvents.forEach(event => {
                if ( event.rrule  && this.dtIsInViewPeriod(event.start, this.viewPeriod.end)) {
                    // Copy object with new references
                    const e = { ...event };
                    e.rrule = { ...e.rrule};
                    // format bymonthday if there is one
                    // e.rrule.bymonthday ?  e.rrule.bymonthday = this.rruleService.bymonthdayFormat(e.rrule.bymonthday)
                    //  : e.rrule.bymonthday = undefined;

                    const newDtStart = this.calendarService.calReccuringEventStartDate(e.rrule.dtstart,
                        moment(viewRender.period.start).startOf('day').toDate());
                    // Setup event recurring rule
                    let rule = null;
                    try {
                        rule = new RRule({
                        ...e.rrule,
                        dtstart: newDtStart,
                        until: this.calendarService.calReccuringEventEndDate(e.rrule.until,
                            moment(viewRender.period.end).endOf('day').toDate())
                       });
                       console.log(e.title);
                       console.log(rule.toText());
                       console.log(rule.all());
                       rule.all().forEach(date => {
                           const e1 = { ...e };
                           e1.start = moment(date).add(1, 'days').toDate();
                           this.recurringEvents.push(e1);
                       });
                    } catch (e) {
                        // logs the exception thrown when recurring events are 0
                        // console.log(e);
                    }
                }
            });
            this.events.concat(this.ogEvents).concat(this.recurringEvents);
            this.events = this.calendarService.removeDuplicates(this.recurringEvents);
            this.recurringEvents = [];
            console.log('setting events');
            console.log(this.events);
            this.cdr.detectChanges();
        }
        console.log(this.events);
    }
    dtIsInViewPeriod(eStart: Date | string, vEnd: Date): boolean {
        console.log('in view period');
        console.log(moment(eStart).diff(vEnd, 'days'));
        return moment(eStart).diff(vEnd, 'days') < -2;
    }
}



