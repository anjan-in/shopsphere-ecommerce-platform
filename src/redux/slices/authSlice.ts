import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, UserProfile } from '../../types/auth.types';
import type { RootState } from '../../app/store';

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  loading: true, // Application starts in a loading initialization state
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logoutSuccess: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setInitialize: (state, action: PayloadAction<UserProfile | null>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    }
  }
});

export const { authStart, authSuccess, authFailure, logoutSuccess, setInitialize } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUserRole = (state: RootState) => state.auth.currentUser?.role;
export const selectAuthLoading = (state: RootState) => state.auth.loading;

export default authSlice.reducer;