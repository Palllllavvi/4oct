// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/policies/policies.actions.ts
// ─────────────────────────────────────────────────────────────────────────────
import { createAction, props } from '@ngrx/store';
import {
  EquipmentPolicy,
  IncomeAssurancePolicy,
  IssueEquipmentPolicyRequest,
  IssueIncomeAssurancePolicyRequest
} from '../models/policy.model';

// ── Equipment Policies ─────────────────────────────────────────────────────

export const loadEquipmentPolicies = createAction('[Policies] Load Equipment Policies');

export const loadEquipmentPoliciesSuccess = createAction(
  '[Policies] Load Equipment Policies Success',
  props<{ policies: EquipmentPolicy[] }>()
);

export const loadEquipmentPoliciesFailure = createAction(
  '[Policies] Load Equipment Policies Failure',
  props<{ error: string }>()
);

export const issueEquipmentPolicy = createAction(
  '[Policies] Issue Equipment Policy',
  props<{ request: IssueEquipmentPolicyRequest }>()
);

export const issueEquipmentPolicySuccess = createAction(
  '[Policies] Issue Equipment Policy Success',
  props<{ policy: EquipmentPolicy }>()
);

export const issueEquipmentPolicyFailure = createAction(
  '[Policies] Issue Equipment Policy Failure',
  props<{ error: string }>()
);

// ── Income Policies ────────────────────────────────────────────────────────

export const loadIncomePolicies = createAction('[Policies] Load Income Policies');

export const loadIncomePoliciesSuccess = createAction(
  '[Policies] Load Income Policies Success',
  props<{ policies: IncomeAssurancePolicy[] }>()
);

export const loadIncomePoliciesFailure = createAction(
  '[Policies] Load Income Policies Failure',
  props<{ error: string }>()
);

export const issueIncomePolicy = createAction(
  '[Policies] Issue Income Policy',
  props<{ request: IssueIncomeAssurancePolicyRequest }>()
);

export const issueIncomePolicySuccess = createAction(
  '[Policies] Issue Income Policy Success',
  props<{ policy: IncomeAssurancePolicy }>()
);

export const issueIncomePolicyFailure = createAction(
  '[Policies] Issue Income Policy Failure',
  props<{ error: string }>()
);

// ── Shared ─────────────────────────────────────────────────────────────────
export const clearPoliciesError = createAction('[Policies] Clear Error');
