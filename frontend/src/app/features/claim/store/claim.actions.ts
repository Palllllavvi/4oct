// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/claims/claims.actions.ts
// ─────────────────────────────────────────────────────────────────────────────
import { createAction, props } from '@ngrx/store';
import {
  EquipmentClaim,
  IncomeClaim,
  ReviewClaimRequest,
  SubmitEquipmentClaimRequest,
  SubmitIncomeClaimRequest
} from '../models/claim.model';

// ── Equipment Claims ─────────────────────────────────────────────────────────

export const loadEquipmentClaims = createAction('[Claims] Load Equipment Claims');

export const loadEquipmentClaimsSuccess = createAction(
  '[Claims] Load Equipment Claims Success',
  props<{ claims: EquipmentClaim[] }>()
);

export const loadEquipmentClaimsFailure = createAction(
  '[Claims] Load Equipment Claims Failure',
  props<{ error: string }>()
);

export const loadEquipmentClaimById = createAction(
  '[Claims] Load Equipment Claim By Id',
  props<{ id: number | string }>()
);

export const loadEquipmentClaimByIdSuccess = createAction(
  '[Claims] Load Equipment Claim By Id Success',
  props<{ claim: EquipmentClaim }>()
);

export const loadEquipmentClaimByIdFailure = createAction(
  '[Claims] Load Equipment Claim By Id Failure',
  props<{ error: string }>()
);

export const submitEquipmentClaim = createAction(
  '[Claims] Submit Equipment Claim',
  props<{ request: SubmitEquipmentClaimRequest }>()
);

export const submitEquipmentClaimSuccess = createAction(
  '[Claims] Submit Equipment Claim Success',
  props<{ claim: EquipmentClaim }>()
);

export const submitEquipmentClaimFailure = createAction(
  '[Claims] Submit Equipment Claim Failure',
  props<{ error: string }>()
);

export const reviewEquipmentClaim = createAction(
  '[Claims] Review Equipment Claim',
  props<{ id: number | string; request: ReviewClaimRequest }>()
);

export const reviewEquipmentClaimSuccess = createAction(
  '[Claims] Review Equipment Claim Success',
  props<{ claim: EquipmentClaim }>()
);

export const reviewEquipmentClaimFailure = createAction(
  '[Claims] Review Equipment Claim Failure',
  props<{ error: string }>()
);

// ── Income Claims ────────────────────────────────────────────────────────────

export const loadIncomeClaims = createAction('[Claims] Load Income Claims');

export const loadIncomeClaimsSuccess = createAction(
  '[Claims] Load Income Claims Success',
  props<{ claims: IncomeClaim[] }>()
);

export const loadIncomeClaimsFailure = createAction(
  '[Claims] Load Income Claims Failure',
  props<{ error: string }>()
);

export const loadIncomeClaimById = createAction(
  '[Claims] Load Income Claim By Id',
  props<{ id: number | string }>()
);

export const loadIncomeClaimByIdSuccess = createAction(
  '[Claims] Load Income Claim By Id Success',
  props<{ claim: IncomeClaim }>()
);

export const loadIncomeClaimByIdFailure = createAction(
  '[Claims] Load Income Claim By Id Failure',
  props<{ error: string }>()
);

export const submitIncomeClaim = createAction(
  '[Claims] Submit Income Claim',
  props<{ request: SubmitIncomeClaimRequest }>()
);

export const submitIncomeClaimSuccess = createAction(
  '[Claims] Submit Income Claim Success',
  props<{ claim: IncomeClaim }>()
);

export const submitIncomeClaimFailure = createAction(
  '[Claims] Submit Income Claim Failure',
  props<{ error: string }>()
);

export const reviewIncomeClaim = createAction(
  '[Claims] Review Income Claim',
  props<{ id: number | string; request: ReviewClaimRequest }>()
);

export const reviewIncomeClaimSuccess = createAction(
  '[Claims] Review Income Claim Success',
  props<{ claim: IncomeClaim }>()
);

export const reviewIncomeClaimFailure = createAction(
  '[Claims] Review Income Claim Failure',
  props<{ error: string }>()
);

// ── Common ───────────────────────────────────────────────────────────────────

export const clearClaimsError = createAction('[Claims] Clear Error');
