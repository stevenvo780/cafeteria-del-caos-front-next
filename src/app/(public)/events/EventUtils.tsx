'use client';
import { Events } from '@/utils/types';
import { 
  add, 
  differenceInHours, 
  isAfter, 
  isBefore, 
  set,
  startOfWeek,
  startOfMonth,
  startOfYear,
  addWeeks,
  addMonths,
  addYears
} from 'date-fns';
import { EventInput } from '@fullcalendar/core';
import { Repetition } from '@/utils/types';
import moment from 'moment-timezone';

const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A6'];

export const getColorForTitle = (title: string): string => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};

export const convertToCalendarEvent = (event: Events): EventInput => {
  // Convertir las fechas UTC del backend a la zona horaria local
  const localStart = moment.utc(event.startDate).local();
  const localEnd = moment.utc(event.endDate).local();

  return {
    id: event.id ? event.id.toString() : undefined,
    title: event.title,
    start: localStart.toISOString(),
    end: localEnd.toISOString(),
    backgroundColor: getColorForTitle(event.title),
    extendedProps: {
      description: event.description,
      repetition: event.repetition,
      author: event.author,
      originalStart: event.startDate, // Mantener referencia UTC original
      originalEnd: event.endDate,     // Mantener referencia UTC original
    },
  };
};

export const convertToBackendEvent = (calendarEvent: EventInput): Events => {
  // Convertir fechas locales a UTC para el backend
  const utcStart = moment(calendarEvent.start).utc();
  const utcEnd = calendarEvent.end ? moment(calendarEvent.end).utc() : utcStart;

  return {
    id: calendarEvent.id ? Number(calendarEvent.id.split('-')[0]) : null,
    title: calendarEvent.title || '',
    description: calendarEvent.extendedProps?.description || '',
    startDate: utcStart.toISOString(),
    endDate: utcEnd.toISOString(),
    eventDate: utcStart.toISOString(),
    repetition: calendarEvent.extendedProps?.repetition,
  };
};

export const generateRecurringEvents = (event: Events): EventInput[] => {
  const events: EventInput[] = [];
  
  // Convertir fechas UTC a objeto Date
  const startDate = moment.utc(event.startDate).toDate();
  const endDate = moment.utc(event.endDate).toDate();
  const duration = differenceInHours(endDate, startDate);

  if (!event.repetition || event.repetition === Repetition.NONE) {
    return [convertToCalendarEvent(event)];
  }

  let currentDate = startDate;
  let occurrenceIndex = 0;
  const oneYearFromStart = add(startDate, { years: 1 });

  while (isBefore(currentDate, oneYearFromStart)) {
    // Crear fechas en UTC
    const eventStart = moment(currentDate).utc();
    const eventEnd = moment(currentDate).add(duration, 'hours').utc();

    events.push({
      id: event.id ? `${event.id}-${occurrenceIndex}` : undefined,
      title: event.title,
      start: eventStart.format(),
      end: eventEnd.format(),
      backgroundColor: getColorForTitle(event.title),
      extendedProps: {
        description: event.description,
        repetition: event.repetition,
        author: event.author,
        originalStart: event.startDate,
        originalEnd: event.endDate,
      },
    });

    switch (event.repetition) {
      case Repetition.DAILY:
        currentDate = add(currentDate, { days: 1 });
        break;
      case Repetition.WEEKLY:
        currentDate = add(currentDate, { weeks: 1 });
        break;
      case Repetition.MONTHLY:
        currentDate = add(currentDate, { months: 1 });
        break;
      case Repetition.YEARLY:
        currentDate = add(currentDate, { years: 1 });
        break;
      case Repetition.FIFTEEN_DAYS:
        currentDate = add(currentDate, { days: 15 });
        break;
      default:
        currentDate = add(currentDate, { years: 1 });
    }

    occurrenceIndex += 1;
  }

  return events;
};

export const getNextOccurrence = (event: Events): Date | null => {
  const now = new Date();
  const startDate = moment.utc(event.startDate).local().toDate();

  if (!event.repetition || isAfter(startDate, now)) {
    return startDate;
  }

  let nextDate: Date | undefined = undefined;

  const eventTime = {
    hours: startDate.getHours(),
    minutes: startDate.getMinutes(),
    seconds: startDate.getSeconds(),
    milliseconds: startDate.getMilliseconds(),
  };

  switch (event.repetition) {
    case Repetition.DAILY:
      nextDate = set(add(now, { days: 1 }), eventTime);
      break;
    case Repetition.WEEKLY: {
      let weekStart = startOfWeek(startDate);
      while (isBefore(weekStart, now)) {
        weekStart = addWeeks(weekStart, 1);
      }
      nextDate = set(weekStart, eventTime);
      break;
    }
    case Repetition.MONTHLY: {
      let monthStart = startOfMonth(startDate);
      while (isBefore(monthStart, now)) {
        monthStart = addMonths(monthStart, 1);
      }
      nextDate = set(monthStart, eventTime);
      break;
    }
    case Repetition.YEARLY: {
      let yearStart = startOfYear(startDate);
      while (isBefore(yearStart, now)) {
        yearStart = addYears(yearStart, 1);
      }
      nextDate = set(yearStart, eventTime);
      break;
    }
    case Repetition.FIFTEEN_DAYS:
      nextDate = generateOccurrencesEveryNDays(startDate, 15, now, eventTime)
        .find(date => isAfter(date, now));
      break;
    default:
      nextDate = startDate;
      break;
  }

  return nextDate || startDate;
};

function generateOccurrencesEveryNDays(
  startDate: Date,
  n: number,
  now: Date,
  eventTime: { hours: number; minutes: number; seconds: number; milliseconds: number }
): Date[] {
  const dates: Date[] = [];
  let currentDate = startDate;

  while (isBefore(currentDate, add(now, { years: 1 }))) {
    const dateWithTime = set(currentDate, eventTime);
    dates.push(dateWithTime);
    currentDate = add(currentDate, { days: n });
  }

  return dates;
}
