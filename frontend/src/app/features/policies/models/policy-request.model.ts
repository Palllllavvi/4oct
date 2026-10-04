// ── Policy Request Models ──────────────────────────────────────────────────
// Used to track freelancer policy applications before underwriter approval.
// Stored in localStorage so both roles can see them (no dedicated backend endpoint needed).

export type PolicyRequestType = 'EQUIPMENT' | 'INCOME';
export type PolicyRequestStatus = 'PENDING' | 'APPROVED' | 'DISAPPROVED';

export interface PolicyRequestBase {
  id: string;               // UUID generated on client
  type: PolicyRequestType;
  status: PolicyRequestStatus;
  freelancerId: number;
  freelancerName: string;
  freelancerEmail: string;
  submittedAt: string;      // ISO date string
  reviewedAt?: string;
  reviewNote?: string;
  quoteData?: any;          // The quote returned by the risk engine
  issuedPolicyId?: number;  // Set when status = APPROVED
  issuedPolicyNumber?: string;
}

// ── Equipment Policy Request ──────────────────────────────────────────────
export interface EquipmentPolicyRequest extends PolicyRequestBase {
  type: 'EQUIPMENT';
  projectId?: number;
  projectName: string;
  clientName: string;
  clientCompanyName?: string;
  location: string;
  startDate: string;
  endDate: string;
  deductibleAmount: number;
  coverages: string[];
  equipmentList: EquipmentRequestItem[];
}

export interface EquipmentRequestItem {
  equipmentType: string;
  brand: string;
  model: string;
  serialNumber: string;
  declaredValue: number;
  condition: string;
}

// ── Income Policy Request ─────────────────────────────────────────────────
export interface IncomePolicyRequest extends PolicyRequestBase {
  type: 'INCOME';
  profession: string;
  experienceYears: number;
  averageMonthlyIncome: number;
  requestedMonthlyBenefit: number;
  benefitPeriodMonths: number;
  coveredEventTypes: string[];
}

export type PolicyRequest = EquipmentPolicyRequest | IncomePolicyRequest;
