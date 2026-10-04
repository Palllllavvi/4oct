// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/claims/claims.effects.ts
// ─────────────────────────────────────────────────────────────────────────────
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ClaimService } from '../services/claim.service';
import { selectUserId, selectUserRole } from '../../auth/store/auth.selectors';
import {
  loadEquipmentClaimById,
  loadEquipmentClaimByIdFailure,
  loadEquipmentClaimByIdSuccess,
  loadEquipmentClaims,
  loadEquipmentClaimsFailure,
  loadEquipmentClaimsSuccess,
  loadIncomeClaimById,
  loadIncomeClaimByIdFailure,
  loadIncomeClaimByIdSuccess,
  loadIncomeClaims,
  loadIncomeClaimsFailure,
  loadIncomeClaimsSuccess,
  reviewEquipmentClaim,
  reviewEquipmentClaimFailure,
  reviewEquipmentClaimSuccess,
  reviewIncomeClaim,
  reviewIncomeClaimFailure,
  reviewIncomeClaimSuccess,
  submitEquipmentClaim,
  submitEquipmentClaimFailure,
  submitEquipmentClaimSuccess,
  submitIncomeClaim,
  submitIncomeClaimFailure,
  submitIncomeClaimSuccess
} from './claim.actions';

@Injectable()
export class ClaimsEffects {
  private readonly actions$ = inject(Actions);
  private readonly claimService = inject(ClaimService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  // ── Equipment Claims List ──────────────────────────────────────────────────
  loadEquipmentClaims$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadEquipmentClaims),
      withLatestFrom(this.store.select(selectUserRole), this.store.select(selectUserId)),
      switchMap(([, role, userId]) => {
        const isGlobal = role === 'ROLE_ASSESSOR' || role === 'ROLE_ADMIN' || !userId;
        const req$ = isGlobal
          ? this.claimService.getAllEquipmentClaims()
          : this.claimService.getEquipmentClaimsForUser(Number(userId));

        return req$.pipe(
          map(res => {
            if (res.success && res.data) {
              return loadEquipmentClaimsSuccess({ claims: res.data });
            }
            return loadEquipmentClaimsFailure({ error: res.message || 'Failed to load equipment claims.' });
          }),
          catchError(err =>
            of(loadEquipmentClaimsFailure({ error: err.error?.message || 'Failed to load equipment claims.' }))
          )
        );
      })
    )
  );

  // ── Load Equipment Claim by ID ─────────────────────────────────────────────
  loadEquipmentClaimById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadEquipmentClaimById),
      switchMap(({ id }) =>
        this.claimService.getEquipmentClaimById(id).pipe(
          map(res => {
            if (res.success && res.data) {
              return loadEquipmentClaimByIdSuccess({ claim: res.data });
            }
            return loadEquipmentClaimByIdFailure({ error: res.message || 'Failed to load equipment claim.' });
          }),
          catchError(err =>
            of(loadEquipmentClaimByIdFailure({ error: err.error?.message || 'Failed to load equipment claim.' }))
          )
        )
      )
    )
  );

  // ── Submit Equipment Claim ─────────────────────────────────────────────────
  submitEquipmentClaim$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitEquipmentClaim),
      switchMap(({ request }) =>
        this.claimService.submitEquipmentClaim(request).pipe(
          map(res => {
            if (res.success && res.data) {
              return submitEquipmentClaimSuccess({ claim: res.data });
            }
            return submitEquipmentClaimFailure({ error: res.message || 'Failed to submit equipment claim.' });
          }),
          catchError(err =>
            of(submitEquipmentClaimFailure({ error: err.error?.message || 'Failed to submit equipment claim.' }))
          )
        )
      )
    )
  );

  submitEquipmentClaimSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(submitEquipmentClaimSuccess),
        tap(() => this.router.navigate(['/claims']))
      ),
    { dispatch: false }
  );

  // ── Review Equipment Claim ─────────────────────────────────────────────────
  reviewEquipmentClaim$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reviewEquipmentClaim),
      switchMap(({ id, request }) =>
        this.claimService.reviewEquipmentClaim(id, request).pipe(
          map(res => {
            if (res.success && res.data) {
              return reviewEquipmentClaimSuccess({ claim: res.data });
            }
            return reviewEquipmentClaimFailure({ error: res.message || 'Failed to review equipment claim.' });
          }),
          catchError(err =>
            of(reviewEquipmentClaimFailure({ error: err.error?.message || 'Failed to review equipment claim.' }))
          )
        )
      )
    )
  );

  // ── Income Claims List ─────────────────────────────────────────────────────
  loadIncomeClaims$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadIncomeClaims),
      withLatestFrom(this.store.select(selectUserRole), this.store.select(selectUserId)),
      switchMap(([, role, userId]) => {
        const isGlobal = role === 'ROLE_ASSESSOR' || role === 'ROLE_ADMIN' || !userId;
        const req$ = isGlobal
          ? this.claimService.getAllIncomeClaims()
          : this.claimService.getIncomeClaimsForUser(Number(userId));

        return req$.pipe(
          map(res => {
            if (res.success && res.data) {
              return loadIncomeClaimsSuccess({ claims: res.data });
            }
            return loadIncomeClaimsFailure({ error: res.message || 'Failed to load income claims.' });
          }),
          catchError(err =>
            of(loadIncomeClaimsFailure({ error: err.error?.message || 'Failed to load income claims.' }))
          )
        );
      })
    )
  );

  // ── Load Income Claim by ID ────────────────────────────────────────────────
  loadIncomeClaimById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadIncomeClaimById),
      switchMap(({ id }) =>
        this.claimService.getIncomeClaimById(id).pipe(
          map(res => {
            if (res.success && res.data) {
              return loadIncomeClaimByIdSuccess({ claim: res.data });
            }
            return loadIncomeClaimByIdFailure({ error: res.message || 'Failed to load income claim.' });
          }),
          catchError(err =>
            of(loadIncomeClaimByIdFailure({ error: err.error?.message || 'Failed to load income claim.' }))
          )
        )
      )
    )
  );

  // ── Submit Income Claim ────────────────────────────────────────────────────
  submitIncomeClaim$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitIncomeClaim),
      switchMap(({ request }) =>
        this.claimService.submitIncomeClaim(request).pipe(
          map(res => {
            if (res.success && res.data) {
              return submitIncomeClaimSuccess({ claim: res.data });
            }
            return submitIncomeClaimFailure({ error: res.message || 'Failed to submit income claim.' });
          }),
          catchError(err =>
            of(submitIncomeClaimFailure({ error: err.error?.message || 'Failed to submit income claim.' }))
          )
        )
      )
    )
  );

  submitIncomeClaimSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(submitIncomeClaimSuccess),
        tap(() => this.router.navigate(['/claims']))
      ),
    { dispatch: false }
  );

  // ── Review Income Claim ────────────────────────────────────────────────────
  reviewIncomeClaim$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reviewIncomeClaim),
      switchMap(({ id, request }) =>
        this.claimService.reviewIncomeClaim(id, request).pipe(
          map(res => {
            if (res.success && res.data) {
              return reviewIncomeClaimSuccess({ claim: res.data });
            }
            return reviewIncomeClaimFailure({ error: res.message || 'Failed to review income claim.' });
          }),
          catchError(err =>
            of(reviewIncomeClaimFailure({ error: err.error?.message || 'Failed to review income claim.' }))
          )
        )
      )
    )
  );
}
