// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/auth/auth.effects.ts
// ─────────────────────────────────────────────────────────────────────────────
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  login,
  loginSuccess,
  loginFailure,
  logout,
  register,
  registerSuccess,
  registerFailure
} from './auth.actions';
import { ApiResponse, AuthResponse } from '../../core/models/user.model';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly http     = inject(HttpClient);
  private readonly router   = inject(Router);

  private readonly baseUrl = `${environment.apiUrl}/api/auth`;

  // ── Login ──────────────────────────────────────────────────────────────
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap(({ credentials }) =>
        this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/login`, credentials).pipe(
          map(res => {
            if (res.success && res.data) {
              return loginSuccess({ authData: res.data });
            }
            return loginFailure({ error: res.message || 'Login failed.' });
          }),
          catchError(err => {
            const msg = err.status === 401 || err.status === 403
              ? 'Invalid email or password.'
              : err.status === 0
                ? `Cannot connect to API Gateway at ${environment.apiUrl}. Ensure backend is running.`
                : err.error?.message || 'An unexpected error occurred.';
            return of(loginFailure({ error: msg }));
          })
        )
      )
    )
  );

  loginSuccessNavigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      ),
    { dispatch: false }
  );

  // ── Register ───────────────────────────────────────────────────────────
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(register),
      switchMap(({ data }) =>
        this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/register`, data).pipe(
          map(res => {
            if (res.success && res.data) {
              return registerSuccess({ authData: res.data });
            }
            return registerFailure({ error: res.message || 'Registration failed.' });
          }),
          catchError(err => {
            const msg = err.error?.message || 'Registration failed. Please try again.';
            return of(registerFailure({ error: msg }));
          })
        )
      )
    )
  );

  registerSuccessNavigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(registerSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      ),
    { dispatch: false }
  );

  // ── Logout ─────────────────────────────────────────────────────────────
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => this.router.navigate(['/login']))
      ),
    { dispatch: false }
  );
}
