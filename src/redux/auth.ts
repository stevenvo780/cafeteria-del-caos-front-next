'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../utils/types';
import { signOutUser } from '../utils/firebaseHelper';

interface AuthState {
  isLoggedIn: boolean;
  userData: User | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  userData: null,
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.isLoggedIn = true;
      state.userData = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(action.payload));
      }
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userData = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userData');
      }
      signOutUser();
    },
    initializeAuth(state) {
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('userData');
        if (userData) {
          state.userData = JSON.parse(userData);
          state.isLoggedIn = true;
        }
      }
    },
  },
});

export const { login, logout, initializeAuth } = auth.actions;

export default auth.reducer;
