export enum PolicyStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  CLAIMED = 'CLAIMED'
}

export interface EquipmentPolicyItemDTO {
  id?: number;
  equipmentId?: number;
  equipmentName: string;
  serialNumber: string;
  insuredValue: number;
  condition?: string;
}

export interface EquipmentPolicy {
  id: number;
  policyNumber: string;
  projectId: number;
  userId: number;
  projectName?: string;
  clientName?: string;
  clientCompanyName?: string;
  startDate: string;
  endDate: string;
  insuredValue: number;
  premium: number;
  deductible?: number;
  status: PolicyStatus;
  items?: EquipmentPolicyItemDTO[];
  issuedAt?: string;
}

export interface IssueEquipmentPolicyItemRequest {
  equipmentId?: number;
  equipmentName: string;
  serialNumber: string;
  insuredValue: number;
  condition?: string;
}

export interface IssueEquipmentPolicyRequest {
  projectId: number;
  userId: number;
  projectName: string;
  clientName: string;
  clientCompanyName?: string;
  startDate: string;
  endDate: string;
  insuredValue: number;
  deductible: number;
  premium?: number;
  items: IssueEquipmentPolicyItemRequest[];
}

export interface IncomeAssurancePolicy {
  id: number;
  policyNumber: string;
  userId: number;
  freelancerName?: string;
  freelancerEmail?: string;
  startDate: string;
  endDate: string;
  monthlyIncome: number;
  benefitMonths: number;
  totalBenefit: number;
  annualPremium: number;
  status: PolicyStatus;
  coveredTerminationTypes?: string;
  waitingPeriodDays?: number;
  issuedAt?: string;
}

export interface IssueIncomeAssurancePolicyRequest {
  userId: number;
  freelancerName: string;
  freelancerEmail: string;
  startDate: string;
  monthlyIncome: number;
  benefitMonths: number;
  annualPremium?: number;
  coveredTerminationTypes: string; // comma-separated e.g. CLIENT_INSOLVENCY,CONTRACT_BREACH,MEDICAL_INCAPACITY
}
