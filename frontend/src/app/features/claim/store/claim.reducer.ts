// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/claims/claims.reducer.ts
// ─────────────────────────────────────────────────────────────────────────────
import { createReducer, on } from '@ngrx/store';
import { ClaimsState, initialClaimsState } from './claim.state';
import {
  clearClaimsError,
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

export const claimsReducer = createReducer(
  initialClaimsState,

  // ── Equipment Claims List ──────────────────────────────────────────────────
  on(loadEquipmentClaims, (state): ClaimsState => ({
    ...state, isLoadingEquipment: true, error: null
  })),
  on(loadEquipmentClaimsSuccess, (state, { claims }): ClaimsState => ({
    ...state, equipmentClaims: claims, isLoadingEquipment: false
  })),
  on(loadEquipmentClaimsFailure, (state, { error }): ClaimsState => ({
    ...state, isLoadingEquipment: false, error
  })),

  // ── Equipment Claim Details ────────────────────────────────────────────────
  on(loadEquipmentClaimById, (state): ClaimsState => ({
    ...state, isLoadingEquipment: true, error: null
  })),
  on(loadEquipmentClaimByIdSuccess, (state, { claim }): ClaimsState => ({
    ...state, selectedEquipmentClaim: claim, isLoadingEquipment: false
  })),
  on(loadEquipmentClaimByIdFailure, (state, { error }): ClaimsState => ({
    ...state, isLoadingEquipment: false, error
  })),

  // ── Submit Equipment Claim ─────────────────────────────────────────────────
  on(submitEquipmentClaim, (state): ClaimsState => ({
    ...state, isSubmitting: true, error: null
  })),
  on(submitEquipmentClaimSuccess, (state, { claim }): ClaimsState => ({
    ...state,
    equipmentClaims: [claim, ...state.equipmentClaims],
    isSubmitting: false
  })),
  on(submitEquipmentClaimFailure, (state, { error }): ClaimsState => ({
    ...state, isSubmitting: false, error
  })),

  // ── Review Equipment Claim ─────────────────────────────────────────────────
  on(reviewEquipmentClaim, (state): ClaimsState => ({
    ...state, isReviewing: true, error: null
  })),
  on(reviewEquipmentClaimSuccess, (state, { claim }): ClaimsState => ({
    ...state,
    equipmentClaims: state.equipmentClaims.map(c => c.id === claim.id ? claim : c),
    selectedEquipmentClaim: state.selectedEquipmentClaim?.id === claim.id ? claim : state.selectedEquipmentClaim,
    isReviewing: false
  })),
  on(reviewEquipmentClaimFailure, (state, { error }): ClaimsState => ({
    ...state, isReviewing: false, error
  })),

  // ── Income Claims List ─────────────────────────────────────────────────────
  on(loadIncomeClaims, (state): ClaimsState => ({
    ...state, isLoadingIncome: true, error: null
  })),
  on(loadIncomeClaimsSuccess, (state, { claims }): ClaimsState => ({
    ...state, incomeClaims: claims, isLoadingIncome: false
  })),
  on(loadIncomeClaimsFailure, (state, { error }): ClaimsState => ({
    ...state, isLoadingIncome: false, error
  })),

  // ── Income Claim Details ───────────────────────────────────────────────────
  on(loadIncomeClaimById, (state): ClaimsState => ({
    ...state, isLoadingIncome: true, error: null
  })),
  on(loadIncomeClaimByIdSuccess, (state, { claim }): ClaimsState => ({
    ...state, selectedIncomeClaim: claim, isLoadingIncome: false
  })),
  on(loadIncomeClaimByIdFailure, (state, { error }): ClaimsState => ({
    ...state, isLoadingIncome: false, error
  })),

  // ── Submit Income Claim ────────────────────────────────────────────────────
  on(submitIncomeClaim, (state): ClaimsState => ({
    ...state, isSubmitting: true, error: null
  })),
  on(submitIncomeClaimSuccess, (state, { claim }): ClaimsState => ({
    ...state,
    incomeClaims: [claim, ...state.incomeClaims],
    isSubmitting: false
  })),
  on(submitIncomeClaimFailure, (state, { error }): ClaimsState => ({
    ...state, isSubmitting: false, error
  })),

  // ── Review Income Claim ────────────────────────────────────────────────────
  on(reviewIncomeClaim, (state): ClaimsState => ({
    ...state, isReviewing: true, error: null
  })),
  on(reviewIncomeClaimSuccess, (state, { claim }): ClaimsState => ({
    ...state,
    incomeClaims: state.incomeClaims.map(c => c.id === claim.id ? claim : c),
    selectedIncomeClaim: state.selectedIncomeClaim?.id === claim.id ? claim : state.selectedIncomeClaim,
    isReviewing: false
  })),
  on(reviewIncomeClaimFailure, (state, { error }): ClaimsState => ({
    ...state, isReviewing: false, error
  })),

  // ── Common ─────────────────────────────────────────────────────────────────
  on(clearClaimsError, (state): ClaimsState => ({ ...state, error: null }))
);
