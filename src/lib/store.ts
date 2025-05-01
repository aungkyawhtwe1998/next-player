'use client';

import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from '@/features/auth/authSlice';
import playerReducer from '@/features/players/playerSlice';
import teamReducer from '@/features/teams/teamSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    players: playerReducer,
    teams: teamReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
