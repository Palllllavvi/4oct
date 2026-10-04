// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/policies/policies.selectors.ts
// ─────────────────────────────────────────────────────────────────────────────
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PoliciesState } from './policy.state';

export const selectPoliciesState = createFeatureSelector<PoliciesState>('policies');

export const selectEquipmentPolicies = createSelector(
  selectPoliciesState,
  (state: PoliciesState) => state.equipmentPolicies
);

export const selectIncomePolicies = createSelector(
  selectPoliciesState,
  (state: PoliciesState) => state.incomePolicies
);

export const selectIsLoadingEquipmentPolicies = createSelector(
  selectPoliciesState,
  (state: PoliciesState) => state.isLoadingEquipment
);

export const selectIsLoadingIncomePolicies = createSelector(
  selectPoliciesState,
  (state: PoliciesState) => state.isLoadingIncome
);

export const selectIsIssuingPolicy = createSelector(
  selectPoliciesState,
  (state: PoliciesState) => state.isIssuing
);

export const selectPoliciesError = createSelector(
  selectPoliciesState,
  (state: PoliciesState) => state.error
);
