'use client';
import { combineReducers } from '@reduxjs/toolkit';
import auth from './auth';
import events from './events';
import ui from './ui';
import publications from './publications';
import library from './library';
import templates from './templates';

const rootReducer = combineReducers({
  auth,
  events,
  ui,
  publications,
  library,
  templates,
});

export default rootReducer;
