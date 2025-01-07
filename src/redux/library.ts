'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Library } from '../utils/types';

interface LibraryState {
  libraries: Library[];
}

const initialState: LibraryState = {
  libraries: [],
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    getLibraries(state, action: PayloadAction<Library[]>) {
      state.libraries = action.payload;
    },
    addLibrary(state, action: PayloadAction<Library>) {
      state.libraries.push(action.payload);
    },
    updateLibrary(state, action: PayloadAction<Library>) {
      const index = state.libraries.findIndex(library => library.id === action.payload.id);
      if (index !== -1) {
        state.libraries[index] = action.payload;
      }
    },
    deleteLibrary(state, action: PayloadAction<number>) {
      state.libraries = state.libraries.filter(library => library.id !== action.payload);
    },
  },
});

export const { getLibraries, addLibrary, updateLibrary, deleteLibrary } = librarySlice.actions;

export default librarySlice.reducer;
