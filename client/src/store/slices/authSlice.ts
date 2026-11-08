import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
}

// Read saved user state synchronously from localStorage on startup
const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
let initialUser: { name: string; email: string } | null = null;
if (savedUser) {
  try {
    initialUser = JSON.parse(savedUser);
  } catch {
    localStorage.removeItem('user');
  }
}

const initialState: AuthState = {
  isAuthenticated: Boolean(initialUser),
  user: initialUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: { name: string; email: string } }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
