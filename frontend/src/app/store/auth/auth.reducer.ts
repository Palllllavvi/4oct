// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/auth/auth.reducer.ts
// ─────────────────────────────────────────────────────────────────────────────
import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import {
  clearAuthError,
  hydrateAuth,
  login,
  loginFailure,
  loginSuccess,
  logout,
  register,
  registerFailure,
  registerSuccess
} from './auth.actions';
import { User } from '../../core/models/user.model';

const TOKEN_KEY = 'auth_token';
const USER_KEY  = 'auth_user';

function persistSession(token: string, user: User): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

function clearSession(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export const authReducer = createReducer(
  initialAuthState,

  // ── Login ────────────────────────────────────────────────────────────────
  on(login, (state): AuthState => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(loginSuccess, (state, { authData }): AuthState => {
    const user: User = {
      userId: authData.userId,
      id:     authData.userId,
      email:  authData.email,
      name:   authData.name,
      role:   authData.role,
      profession: authData.profession
    };
    persistSession(authData.token, user);
    return {
      ...state,
      user,
      token: authData.token,
      isAuthenticated: true,
      isLoading: false,
      error: null
    };
  }),

  on(loginFailure, (state, { error }): AuthState => ({
    ...state,
    isLoading: false,
    error
  })),

  // ── Register ─────────────────────────────────────────────────────────────
  on(register, (state): AuthState => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(registerSuccess, (state, { authData }): AuthState => {
    const user: User = {
      userId: authData.userId,
      id:     authData.userId,
      email:  authData.email,
      name:   authData.name,
      role:   authData.role,
      profession: authData.profession
    };
    persistSession(authData.token, user);
    return {
      ...state,
      user,
      token: authData.token,
      isAuthenticated: true,
      isLoading: false,
      error: null
    };
  }),

  on(registerFailure, (state, { error }): AuthState => ({
    ...state,
    isLoading: false,
    error
  })),

  // ── Logout ───────────────────────────────────────────────────────────────
  on(logout, (): AuthState => {
    clearSession();
    return { ...initialAuthState };
  }),

  // ── Hydrate ──────────────────────────────────────────────────────────────
  on(hydrateAuth, (state, { user, token }): AuthState => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null
  })),

  // ── Clear Error ──────────────────────────────────────────────────────────
  on(clearAuthError, (state): AuthState => ({
    ...state,
    error: null
  }))
);
