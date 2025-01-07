'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Template } from '../utils/types';
interface TemplateState {
  templates: Template[];
}

const initialState: TemplateState = {
  templates: [],
};

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    getTemplates(state, action: PayloadAction<Template[]>) {
      state.templates = action.payload;
    },
    addTemplate(state, action: PayloadAction<Template>) {
      state.templates.push(action.payload);
    },
    updateTemplate(state, action: PayloadAction<Template>) {
      const index = state.templates.findIndex(template => template.id === action.payload.id);
      if (index !== -1) {
        state.templates[index] = action.payload;
      }
    },
    deleteTemplate(state, action: PayloadAction<number>) {
      state.templates = state.templates.filter(template => template.id !== action.payload);
    },
  },
});

export const { getTemplates, addTemplate, updateTemplate, deleteTemplate } = templateSlice.actions;

export default templateSlice.reducer;
