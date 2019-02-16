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
import { NGXLogger } from 'ngx-logger';
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
    newExpenseModalConfig = {
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

    constructor(private calendarService: CalendarService, private logger: NGXLogger,
        public dialog: MatDialog, private cdr: ChangeDetectorRef, private rruleService: RruleService) { }

    /**
     * Pulls User's ExpenseEvents
     *  sets:
     *      -ogEvents[]
     *      -events
     */
    ngOnInit() {
        this.logger.trace('ngOnInit()');
        this.calendarService.fetchCalendarEvents()
            .subscribe(data => {
                // Set Original DB Events to new object reference
                this.ogEvents = [...this.calendarService.processCalendarEvents(data)];

                // initial Calendar View Period
                const viewRender: CalendarMonthViewBeforeRenderEvent = {
                    header: [],
                    body: [],
                    period: this.viewPeriod
                };

                this.updateCalendarEvents(viewRender, true);
                this.logger.info(`Original DB Events Formatted`);
                console.log(this.ogEvents);
                this.logger.info('Processed Events');
                console.log(this.events);
            });
    }

    /**
     * Opens New Expense Modal
     *  once closed, new expense will be added
     *  to the events[]
     */
    openNewExpenseDialog(): void {
        const dialogRef = this.dialog.open(CalendarNewExpenseComponent, this.newExpenseModalConfig);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.newExpense.push(result);
                this.events.push(this.calendarService.processCalendarEvents(this.newExpense)[0]);
                this.calendarService.persistExpense(this.newExpense[0]);
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
        | CalendarDayViewBeforeRenderEvent, force: boolean): void {
        this.logger.trace('updateCalendarEvents()');
        if (
            force ||
            !this.viewPeriod ||
            !moment(this.viewPeriod.start).isSame(viewRender.period.start) ||
            !moment(this.viewPeriod.end).isSame(viewRender.period.end)
        ) {
            // init
            this.viewPeriod = viewRender.period;
            this.events = [];

            // calculations
            this.getRecurringEvents(viewRender);

            // set properties
            this.events.push(...this.ogEvents);
            this.events.push(...this.recurringEvents);
            this.events = this.calendarService.removeDuplicates(this.events);
            this.recurringEvents = [];
            this.cdr.detectChanges();
        }
    }

    getRecurringEvents(viewRender: CalendarMonthViewBeforeRenderEvent
        | CalendarWeekViewBeforeRenderEvent | CalendarDayViewBeforeRenderEvent) {

        this.ogEvents.forEach(event => {
            if (event.rrule && this.dtIsInViewPeriod(event.start, this.viewPeriod.end)) {
                // Copy object with new references
                const e = { ...event };
                e.rrule = { ...e.rrule };

                // Setup event recurring rule
                const recurringDates = this.getRecurringDates(e, viewRender.period.start, viewRender.period.end);
                recurringDates.forEach(date => {
                    const e1: ExpenseEvent = { ...e };
                    e1.start = moment(date).toDate();
                    this.recurringEvents.push(e1);
                });
            }
        });
    }

    /** */
    getRecurringDates(e: ExpenseEvent, viewStart: Date, viewEnd: Date): any[] {
        console.log('---------------------');
        console.log(' getRecurringDates()');
        console.log('estart/end & viewstart/end');
        console.log(e.rrule.dtstart + ' ' + e.rrule.until);
        console.log( viewStart + ' ' + viewEnd);
        const newDtStart = this.calendarService.calReccuringEventStartDate(e.rrule.dtstart, viewStart, e.rrule.freq);
        const newDtUntil = this.calendarService.calReccuringEventEndDate(e.rrule.until, viewEnd);
        console.log('selected start date' + newDtStart);
        console.log('selected until date' + newDtUntil);
        let rule = null;
        try {
            rule = new RRule({
                ...e.rrule,
                dtstart: moment(newDtStart).hour(17).toDate(),
                until: newDtUntil
            });
            console.log(rule);
            console.log(rule.all());
            return rule.all();
        } catch (e) {
            // logs the exception thrown when recurring events are 0
            console.log(e);
        }
    }

    /**
     *
     * @param eStart: Date | String
     * @param vEnd: Date
     */
    dtIsInViewPeriod(eStart: Date | string, vEnd: Date): boolean {
        return moment(eStart).diff(vEnd, 'days') < -2;
    }
}



