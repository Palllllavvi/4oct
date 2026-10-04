// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/claims/claims.state.ts
// ─────────────────────────────────────────────────────────────────────────────
import { EquipmentClaim, IncomeClaim } from '../models/claim.model';

export interface ClaimsState {
  equipmentClaims: EquipmentClaim[];
  incomeClaims: IncomeClaim[];
  selectedEquipmentClaim: EquipmentClaim | null;
  selectedIncomeClaim: IncomeClaim | null;
  isLoadingEquipment: boolean;
  isLoadingIncome: boolean;
  isSubmitting: boolean;
  isReviewing: boolean;
  error: string | null;
}

export const initialClaimsState: ClaimsState = {
  equipmentClaims: [],
  incomeClaims: [],
  selectedEquipmentClaim: null,
  selectedIncomeClaim: null,
  isLoadingEquipment: false,
  isLoadingIncome: false,
  isSubmitting: false,
  isReviewing: false,
  error: null
};
