'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Events } from '../utils/types';

function convertUTCToLocal(date: Date): Date {
  const utcDate = new Date(date);
  const offset = utcDate.getTimezoneOffset() * 60000;
  return new Date(utcDate.getTime() - offset);
}

interface EventsState {
  events: Events[];
  selectedEvent: Events | null;
}

const initialState: EventsState = {
  events: [],
  selectedEvent: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    getEvents(state, action: PayloadAction<Events[]>) {
      state.events = action.payload.map(event => ({
        ...event,
        eventDate: convertUTCToLocal(event.eventDate),
        startDate: convertUTCToLocal(event.startDate),
        endDate: convertUTCToLocal(event.endDate),
      }));
    },
    getEvent(state, action: PayloadAction<Events>) {
      state.selectedEvent = {
        ...action.payload,
        eventDate: convertUTCToLocal(action.payload.eventDate),
        startDate: convertUTCToLocal(action.payload.startDate),
        endDate: convertUTCToLocal(action.payload.endDate),
      };
    },
    addEvent(state, action: PayloadAction<Events>) {
      const newEvent = {
        ...action.payload,
        eventDate: convertUTCToLocal(action.payload.eventDate),
        startDate: convertUTCToLocal(action.payload.startDate),
        endDate: convertUTCToLocal(action.payload.endDate),
      };
      state.events.push(newEvent);
    },
    updateEvent(state, action: PayloadAction<Events>) {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = {
          ...action.payload,
          eventDate: convertUTCToLocal(action.payload.eventDate),
          startDate: convertUTCToLocal(action.payload.startDate),
          endDate: convertUTCToLocal(action.payload.endDate),
        };
      }
    },
    deleteEvent(state, action: PayloadAction<number>) {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
  },
});

export const {
  getEvents,
  getEvent,
  addEvent,
  updateEvent,
  deleteEvent,
} = eventsSlice.actions;

export default eventsSlice.reducer;
