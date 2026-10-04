// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/auth/auth.selectors.ts
// ─────────────────────────────────────────────────────────────────────────────
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectCurrentUser    = createSelector(selectAuthState, s => s.user);
export const selectToken          = createSelector(selectAuthState, s => s.token);
export const selectIsAuthenticated = createSelector(selectAuthState, s => s.isAuthenticated);
export const selectAuthLoading    = createSelector(selectAuthState, s => s.isLoading);
export const selectAuthError      = createSelector(selectAuthState, s => s.error);

export const selectUserRole = createSelector(
  selectCurrentUser,
  user => (user?.role as string) ?? null
);

export const selectUserId = createSelector(
  selectCurrentUser,
  user => user?.userId ?? user?.id ?? null
);

export const selectUserName = createSelector(
  selectCurrentUser,
  user => user?.name ?? null
);
