'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../utils/types';
import { signOutUser } from '../utils/firebaseHelper';

interface AuthState {
  isLoggedIn: boolean;
  userData: User | null;
}

const persistedUser = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData') as string) : null;

const initialState: AuthState = {
  isLoggedIn: !!persistedUser,
  userData: persistedUser,
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.isLoggedIn = true;
      state.userData = action.payload;
      localStorage.setItem('userData', JSON.stringify(action.payload));
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userData = null;
      localStorage.removeItem('userData');
      signOutUser();
    },
  },
});

export const { login, logout } = auth.actions;

export default auth.reducer;
