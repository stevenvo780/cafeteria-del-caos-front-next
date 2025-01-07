'use client';
import { Events } from '@/utils/types';
import { add, eachWeekOfInterval, eachMonthOfInterval, eachYearOfInterval, differenceInHours, isAfter, isBefore, set } from 'date-fns';
import { EventInput } from '@fullcalendar/core';
import { Repetition } from '@/utils/types';

const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A6'];

export const getColorForTitle = (title: string): string => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};

export const convertToCalendarEvent = (event: Events): EventInput => {
  return {
    id: event.id?.toString(),
    title: event.title,
    start: event.startDate,
    end: event.endDate,
    backgroundColor: getColorForTitle(event.title),
    extendedProps: {
      description: event.description,
      repetition: event.repetition,
      author: event.author,
      originalStart: event.startDate,
      originalEnd: event.endDate
    }
  };
};

export const convertToBackendEvent = (calendarEvent: EventInput): Events => ({
  id: calendarEvent.id ? Number(calendarEvent.id.split('-')[0]) : null, // Manejar IDs de eventos recurrentes
  title: calendarEvent.title || '',
  description: calendarEvent.extendedProps?.description || '',
  startDate: calendarEvent.extendedProps?.originalStart || calendarEvent.start as string,
  endDate: calendarEvent.extendedProps?.originalEnd || (calendarEvent.end as string) || calendarEvent.start as string,
  eventDate: calendarEvent.extendedProps?.originalStart || calendarEvent.start as string,
  repetition: calendarEvent.extendedProps?.repetition,
});

export const generateRecurringEvents = (event: Events): EventInput[] => {
  if (!event.startDate || !event.endDate) return [];

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const duration = differenceInHours(endDate, startDate);

  if (!event.repetition || event.repetition === Repetition.NONE) {
    return [convertToCalendarEvent(event)];
  }

  const events: EventInput[] = [];
  let currentDate = new Date(startDate);
  const oneYearFromStart = add(startDate, { years: 1 });
  let index = 0;

  while (isBefore(currentDate, oneYearFromStart)) {
    const eventEnd = add(currentDate, { hours: duration });
    
    events.push({
      id: `${event.id}-${index}`,
      title: event.title,
      start: currentDate.toISOString(),
      end: eventEnd.toISOString(),
      backgroundColor: getColorForTitle(event.title),
      extendedProps: {
        description: event.description,
        repetition: event.repetition,
        author: event.author,
        originalStart: event.startDate,
        originalEnd: event.endDate
      }
    });

    switch (event.repetition) {
      case Repetition.DAILY:
        currentDate = add(currentDate, { days: 1 });
        break;
      case Repetition.WEEKLY:
        currentDate = add(currentDate, { weeks: 1 });
        break;
      case Repetition.FIFTEEN_DAYS:
        currentDate = add(currentDate, { days: 15 });
        break;
      case Repetition.MONTHLY:
        currentDate = add(currentDate, { months: 1 });
        break;
      case Repetition.YEARLY:
        currentDate = add(currentDate, { years: 1 });
        break;
    }
    
    index++;
  }

  return events;
};

export const getNextOccurrence = (event: Events): Date | null => {
  const now = new Date();
  const startDate = new Date(event.startDate);

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
    case Repetition.WEEKLY:
      nextDate = eachWeekOfInterval({ start: startDate, end: add(now, { months: 1 }) })
        .map(date => set(date, eventTime))
        .find(date => isAfter(date, now));
      break;
    case Repetition.MONTHLY:
      nextDate = eachMonthOfInterval({ start: startDate, end: add(now, { years: 1 }) })
        .map(date => set(date, eventTime))
        .find(date => isAfter(date, now));
      break;
    case Repetition.YEARLY:
      nextDate = eachYearOfInterval({ start: startDate, end: add(now, { years: 5 }) })
        .map(date => set(date, eventTime))
        .find(date => isAfter(date, now));
      break;
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
