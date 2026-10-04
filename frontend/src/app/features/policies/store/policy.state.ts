// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/policies/policies.state.ts
// ─────────────────────────────────────────────────────────────────────────────
import { EquipmentPolicy, IncomeAssurancePolicy } from '../models/policy.model';

export interface PoliciesState {
  equipmentPolicies: EquipmentPolicy[];
  incomePolicies: IncomeAssurancePolicy[];
  isLoadingEquipment: boolean;
  isLoadingIncome: boolean;
  isIssuing: boolean;
  error: string | null;
}

export const initialPoliciesState: PoliciesState = {
  equipmentPolicies: [],
  incomePolicies: [],
  isLoadingEquipment: false,
  isLoadingIncome: false,
  isIssuing: false,
  error: null
};
