// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/claims/claims.selectors.ts
// ─────────────────────────────────────────────────────────────────────────────
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClaimsState } from './claim.state';

export const selectClaimsState = createFeatureSelector<ClaimsState>('claims');

export const selectEquipmentClaims = createSelector(
  selectClaimsState,
  (state: ClaimsState) => state.equipmentClaims
);

export const selectIncomeClaims = createSelector(
  selectClaimsState,
  (state: ClaimsState) => state.incomeClaims
);

export const selectSelectedEquipmentClaim = createSelector(
  selectClaimsState,
  (state: ClaimsState) => state.selectedEquipmentClaim
);

export const selectSelectedIncomeClaim = createSelector(
  selectClaimsState,
  (state: ClaimsState) => state.selectedIncomeClaim
);

export const selectIsLoadingEquipmentClaims = createSelector(
  selectClaimsState,
  (state: ClaimsState) => state.isLoadingEquipment
);

export const selectIsLoadingIncomeClaims = createSelector(
  selectClaimsState,
  (state: ClaimsState) => state.isLoadingIncome
);

export const selectIsSubmittingClaim = createSelector(
  selectClaimsState,
  (state: ClaimsState) => state.isSubmitting
);

export const selectIsReviewingClaim = createSelector(
  selectClaimsState,
  (state: ClaimsState) => state.isReviewing
);

export const selectClaimsError = createSelector(
  selectClaimsState,
  (state: ClaimsState) => state.error
);
