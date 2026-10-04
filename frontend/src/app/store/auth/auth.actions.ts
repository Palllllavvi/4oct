// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/auth/auth.actions.ts
// ─────────────────────────────────────────────────────────────────────────────
import { createAction, props } from '@ngrx/store';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../../core/models/user.model';

// ── Login ──────────────────────────────────────────────────────────────────

export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginRequest }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ authData: AuthResponse }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// ── Register ───────────────────────────────────────────────────────────────

export const register = createAction(
  '[Auth] Register',
  props<{ data: RegisterRequest }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ authData: AuthResponse }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

// ── Logout ─────────────────────────────────────────────────────────────────

export const logout = createAction('[Auth] Logout');

// ── Hydrate from localStorage ──────────────────────────────────────────────

export const hydrateAuth = createAction(
  '[Auth] Hydrate',
  props<{ user: User; token: string }>()
);

export const clearAuthError = createAction('[Auth] Clear Error');
