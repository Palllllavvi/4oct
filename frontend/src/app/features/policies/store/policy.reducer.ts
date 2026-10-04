// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/policies/policies.reducer.ts
// ─────────────────────────────────────────────────────────────────────────────
import { createReducer, on } from '@ngrx/store';
import { PoliciesState, initialPoliciesState } from './policy.state';
import {
  clearPoliciesError,
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

export const policiesReducer = createReducer(
  initialPoliciesState,

  // ── Equipment ─────────────────────────────────────────────────────────────
  on(loadEquipmentPolicies, (state): PoliciesState => ({
    ...state, isLoadingEquipment: true, error: null
  })),
  on(loadEquipmentPoliciesSuccess, (state, { policies }): PoliciesState => ({
    ...state, equipmentPolicies: policies, isLoadingEquipment: false
  })),
  on(loadEquipmentPoliciesFailure, (state, { error }): PoliciesState => ({
    ...state, isLoadingEquipment: false, error
  })),

  on(issueEquipmentPolicy, (state): PoliciesState => ({
    ...state, isIssuing: true, error: null
  })),
  on(issueEquipmentPolicySuccess, (state, { policy }): PoliciesState => ({
    ...state,
    equipmentPolicies: [policy, ...state.equipmentPolicies],
    isIssuing: false
  })),
  on(issueEquipmentPolicyFailure, (state, { error }): PoliciesState => ({
    ...state, isIssuing: false, error
  })),

  // ── Income ────────────────────────────────────────────────────────────────
  on(loadIncomePolicies, (state): PoliciesState => ({
    ...state, isLoadingIncome: true, error: null
  })),
  on(loadIncomePoliciesSuccess, (state, { policies }): PoliciesState => ({
    ...state, incomePolicies: policies, isLoadingIncome: false
  })),
  on(loadIncomePoliciesFailure, (state, { error }): PoliciesState => ({
    ...state, isLoadingIncome: false, error
  })),

  on(issueIncomePolicy, (state): PoliciesState => ({
    ...state, isIssuing: true, error: null
  })),
  on(issueIncomePolicySuccess, (state, { policy }): PoliciesState => ({
    ...state,
    incomePolicies: [policy, ...state.incomePolicies],
    isIssuing: false
  })),
  on(issueIncomePolicyFailure, (state, { error }): PoliciesState => ({
    ...state, isIssuing: false, error
  })),

  on(clearPoliciesError, (state): PoliciesState => ({ ...state, error: null }))
);
