// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/policies/policies.effects.ts
// ─────────────────────────────────────────────────────────────────────────────
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { PolicyService } from '../services/policy.service';
import { selectUserId, selectUserRole } from '../../auth/store/auth.selectors';
import {
  issueEquipmentPolicy,
  issueEquipmentPolicyFailure,
  issueEquipmentPolicySuccess,
  issueIncomePolicy,
  issueIncomePolicyFailure,
  issueIncomePolicySuccess,
  loadEquipmentPolicies,
  loadEquipmentPoliciesFailure,
  loadEquipmentPoliciesSuccess,
  loadIncomePolicies,
  loadIncomePoliciesFailure,
  loadIncomePoliciesSuccess
} from './policy.actions';

@Injectable()
export class PoliciesEffects {
  private readonly actions$ = inject(Actions);
  private readonly policyService = inject(PolicyService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  // ── Load Equipment Policies ────────────────────────────────────────────────
  loadEquipmentPolicies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadEquipmentPolicies),
      withLatestFrom(this.store.select(selectUserRole), this.store.select(selectUserId)),
      switchMap(([, role, userId]) => {
        const req$ =
          role === 'ROLE_UNDERWRITER' || role === 'ROLE_ADMIN' || !userId
            ? this.policyService.getAllEquipmentPolicies()
            : this.policyService.getEquipmentPoliciesForUser(Number(userId));

        return req$.pipe(
          map(res => {
            if (res.success && res.data) {
              return loadEquipmentPoliciesSuccess({ policies: res.data });
            }
            return loadEquipmentPoliciesFailure({ error: res.message || 'Failed to load equipment policies.' });
          }),
          catchError(err =>
            of(loadEquipmentPoliciesFailure({ error: err.error?.message || 'Failed to load equipment policies.' }))
          )
        );
      })
    )
  );

  // ── Issue Equipment Policy ─────────────────────────────────────────────────
  issueEquipmentPolicy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(issueEquipmentPolicy),
      switchMap(({ request }) =>
        this.policyService.issueEquipmentPolicy(request).pipe(
          map(res => {
            if (res.success && res.data) {
              return issueEquipmentPolicySuccess({ policy: res.data });
            }
            return issueEquipmentPolicyFailure({ error: res.message || 'Failed to issue equipment policy.' });
          }),
          catchError(err =>
            of(issueEquipmentPolicyFailure({ error: err.error?.message || 'Failed to issue equipment policy.' }))
          )
        )
      )
    )
  );

  issueEquipmentPolicySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(issueEquipmentPolicySuccess),
        tap(() => this.router.navigate(['/policies/equipment']))
      ),
    { dispatch: false }
  );

  // ── Load Income Policies ───────────────────────────────────────────────────
  loadIncomePolicies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadIncomePolicies),
      withLatestFrom(this.store.select(selectUserRole), this.store.select(selectUserId)),
      switchMap(([, role, userId]) => {
        const req$ =
          role === 'ROLE_UNDERWRITER' || role === 'ROLE_ADMIN' || !userId
            ? this.policyService.getAllIncomePolicies()
            : this.policyService.getIncomePoliciesForUser(Number(userId));

        return req$.pipe(
          map(res => {
            if (res.success && res.data) {
              return loadIncomePoliciesSuccess({ policies: res.data });
            }
            return loadIncomePoliciesFailure({ error: res.message || 'Failed to load income policies.' });
          }),
          catchError(err =>
            of(loadIncomePoliciesFailure({ error: err.error?.message || 'Failed to load income policies.' }))
          )
        );
      })
    )
  );

  // ── Issue Income Policy ────────────────────────────────────────────────────
  issueIncomePolicy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(issueIncomePolicy),
      switchMap(({ request }) =>
        this.policyService.issueIncomePolicy(request).pipe(
          map(res => {
            if (res.success && res.data) {
              return issueIncomePolicySuccess({ policy: res.data });
            }
            return issueIncomePolicyFailure({ error: res.message || 'Failed to issue income policy.' });
          }),
          catchError(err =>
            of(issueIncomePolicyFailure({ error: err.error?.message || 'Failed to issue income policy.' }))
          )
        )
      )
    )
  );

  issueIncomePolicySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(issueIncomePolicySuccess),
        tap(() => this.router.navigate(['/policies/income']))
      ),
    { dispatch: false }
  );
}
