'use client';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './rootReducer';
import { Middleware } from 'redux';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // solo persistir auth si es necesario
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Middleware personalizado para manejar acciones no serializables
const nonSerializableMiddleware: Middleware = () => (next) => (action) => {
  return next(action);
};

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'REGISTER'],
      },
    }).concat(nonSerializableMiddleware),
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
