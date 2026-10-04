export enum ClaimStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SETTLED = 'SETTLED'
}

export enum IncidentType {
  THEFT = 'THEFT',
  DAMAGE = 'DAMAGE',
  LOSS = 'LOSS',
  WATER_DAMAGE = 'WATER_DAMAGE',
  FIRE = 'FIRE',
  TRANSIT_ACCIDENT = 'TRANSIT_ACCIDENT',
  OTHER = 'OTHER'
}

export enum TerminationType {
  CLIENT_INSOLVENCY = 'CLIENT_INSOLVENCY',
  CONTRACT_BREACH = 'CONTRACT_BREACH',
  MEDICAL_INCAPACITY = 'MEDICAL_INCAPACITY',
  FORCE_MAJEURE = 'FORCE_MAJEURE',
  CLIENT_DEFAULT = 'CLIENT_DEFAULT',
  OTHER = 'OTHER'
}

export interface EquipmentClaim {
  id: number;
  claimNumber: string;
  policyNumber: string;
  userId: number;
  projectId?: number;
  equipmentId?: number;
  equipmentName?: string;
  incidentType: IncidentType;
  incidentDate: string;
  incidentDescription: string;
  incidentLocation?: string;
  claimedAmount: number;
  approvedAmount?: number;
  reportingPolice: string;
  policeReportNumber?: string;
  documentRefs?: string;
  status: ClaimStatus;
  assessorNotes?: string;
  assessorId?: string;
  submittedAt: string;
  reviewedAt?: string;
  settledAt?: string;
}

export interface IncomeClaim {
  id: number;
  claimNumber: string;
  policyNumber: string;
  userId: number;
  freelancerName?: string;
  freelancerEmail?: string;
  terminationType: TerminationType;
  terminationDate: string;
  terminationDescription: string;
  contractingClientName?: string;
  medicalCondition?: string;
  treatingPhysician?: string;
  incapacityStartDate?: string;
  monthlyBenefitClaimed: number;
  benefitMonthsClaimed: number;
  totalBenefitClaimed?: number;
  approvedBenefitAmount?: number;
  documentRefs?: string;
  status: ClaimStatus;
  assessorNotes?: string;
  assessorId?: string;
  submittedAt: string;
  reviewedAt?: string;
  settledAt?: string;
}

export interface SubmitEquipmentClaimRequest {
  policyNumber: string;
  userId?: number;
  projectId?: number;
  equipmentId?: number;
  equipmentName?: string;
  incidentType: IncidentType;
  incidentDate: string;
  incidentDescription: string;
  incidentLocation?: string;
  claimedAmount: number;
  reportingPolice: string; // "YES" or "NO"
  policeReportNumber?: string;
  documentRefs?: string;
}

export interface SubmitIncomeClaimRequest {
  policyNumber: string;
  userId?: number;
  freelancerName: string;
  freelancerEmail: string;
  terminationType: TerminationType;
  terminationDate: string;
  terminationDescription: string;
  contractingClientName?: string;
  medicalCondition?: string;
  treatingPhysician?: string;
  incapacityStartDate?: string;
  monthlyBenefitClaimed: number;
  benefitMonthsClaimed: number;
  documentRefs?: string;
}

export interface ReviewClaimRequest {
  status: ClaimStatus; // UNDER_REVIEW, APPROVED, REJECTED, SETTLED
  assessorNotes: string;
  assessorId?: string;
  approvedAmount?: number;
}
