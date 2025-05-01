import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadAuthUser, saveAuthUser, clearAuthUser } from './storage';
import { AuthUser } from './types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: loadAuthUser(),
  isAuthenticated: !!loadAuthUser(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      saveAuthUser(action.payload);
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      clearAuthUser();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
