import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
    CalendarDayViewBeforeRenderEvent, CalendarEventTimesChangedEvent,
    CalendarMonthViewBeforeRenderEvent, CalendarView, CalendarWeekViewBeforeRenderEvent
} from 'angular-calendar';
import { ViewPeriod } from 'calendar-utils';
import { isSameDay, isSameMonth } from 'date-fns';
import moment from 'moment-timezone';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { ExpenseEvent } from './expense-event';
import { CalendarService } from './services/calendar.service';
import { RruleService } from 'src/app/shared/rrule/rrule.service';
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


    recurringEvents: ExpenseEvent[] = [];
    refresh: Subject<any> = new Subject();
    activeDayIsOpen = false;

    constructor(public calendarService: CalendarService, private logger: NGXLogger,
        private cdr: ChangeDetectorRef, private rruleService: RruleService) { }

    /**
     * Pulls User's ExpenseEvents
     *  sets:
     *      -ogEvents[]
     *      -events
     */
    ngOnInit() {
        this.logger.trace('ngOnInit()');
        this.calendarService.processCalendarEvents();
        this.calendarService.calendarEvent$.subscribe(data => {
            console.log('new behavior');
            console.log(data);
            // initial Calendar View Period
            const viewRender: CalendarMonthViewBeforeRenderEvent = {
                header: [],
                body: [],
                period: this.viewPeriod
            };
            this.updateCalendarEvents(viewRender, true);
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
    this.calendarService.events = [];

    // calculations
    this.getRecurringEvents(viewRender);

    // set properties
    this.calendarService.events.push(...this.calendarService.ogEvents);
    this.calendarService.events.push(...this.recurringEvents);
    this.calendarService.events = this.calendarService.removeDuplicates(this.calendarService.events);
    this.recurringEvents = [];
    this.cdr.detectChanges();
}
    }

getRecurringEvents(viewRender: CalendarMonthViewBeforeRenderEvent
    | CalendarWeekViewBeforeRenderEvent | CalendarDayViewBeforeRenderEvent) {

    console.log('ogEvent');
    console.log(this.calendarService.ogEvents);
    this.calendarService.ogEvents.forEach(event => {
        if (event.rrule && this.dtIsInViewPeriod(event.start, this.viewPeriod.end)) {
            // Copy object with new references
            const e = { ...event };
            e.rrule = { ...e.rrule };

            // dtStart - view date or recurring? & set to the 17th hour to prevent daylight saving time issue
            let newDtStart = this.calendarService.calReccuringEventStartDate(e.rrule.dtstart, viewRender.period.start, e.rrule.freq);
            newDtStart = moment(newDtStart).hour(17).toDate();
            // dtUntil same as start
            const newDtUntil = this.calendarService.calReccuringEventEndDate(e.rrule.until, viewRender.period.end);

            // Setup event recurring rule
            const recurringDates = this.rruleService.getRecurringDates(e.rrule, newDtStart, newDtUntil);
            recurringDates.forEach(date => {
                const e1: ExpenseEvent = { ...e };
                e1.start = moment(date).toDate();
                this.recurringEvents.push(e1);
            });
        }
    });
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



