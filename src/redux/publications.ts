'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Publication } from '../utils/types';

interface PublicationsState {
  publications: Publication[];
}

const initialState: PublicationsState = {
  publications: [],
};

const publicationsSlice = createSlice({
  name: 'publications',
  initialState,
  reducers: {
    getPublications(state, action: PayloadAction<Publication[]>) {
      const existingPublications = new Map(state.publications.map(publication => [publication.id, publication]));

      action.payload.forEach(publication => {
        existingPublications.set(publication.id, publication);
      });

      state.publications = Array.from(existingPublications.values()).sort((a, b) => b.id - a.id);
    },
    addPublication(state, action: PayloadAction<Publication>) {
      if (!state.publications.some(pub => pub.id === action.payload.id)) {
        state.publications.unshift(action.payload);
      }
    },
    updatePublication(state, action: PayloadAction<Publication>) {
      const index = state.publications.findIndex(pub => pub.id === action.payload.id);
      if (index !== -1) {
        state.publications[index] = action.payload;
      }
    },
    deletePublication(state, action: PayloadAction<number>) {
      state.publications = state.publications.filter(pub => pub.id !== action.payload);
    },
  },
});

export const {
  getPublications,
  addPublication,
  updatePublication,
  deletePublication,
} = publicationsSlice.actions;

export default publicationsSlice.reducer;
