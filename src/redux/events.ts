'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Events } from '../utils/types';

// Eliminar esta función ya que manejaremos fechas como strings
// function convertUTCToLocal(date: Date): Date {
//   const utcDate = new Date(date);
//   const offset = utcDate.getTimezoneOffset() * 60000;
//   return new Date(utcDate.getTime() - offset);
// }

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
        startDate: event.startDate,
        endDate: event.endDate,
        eventDate: event.eventDate,
      }));
    },
    getEvent(state, action: PayloadAction<Events>) {
      state.selectedEvent = {
        ...action.payload,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        eventDate: action.payload.eventDate,
      };
    },
    addEvent(state, action: PayloadAction<Events>) {
      const newEvent = {
        ...action.payload,
        eventDate: action.payload.eventDate,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
      };
      state.events.push(newEvent);
    },
    updateEvent(state, action: PayloadAction<Events>) {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = {
          ...action.payload,
          eventDate: action.payload.eventDate,
          startDate: action.payload.startDate,
          endDate: action.payload.endDate,
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
