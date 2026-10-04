export interface EquipmentItemQuoteDTO {
  equipmentType: string;
  brand: string;
  model: string;
  serialNumber: string;
  declaredValue: number;
  condition: string;
}

export interface EquipmentQuoteRequest {
  projectId?: number;
  equipmentList: EquipmentItemQuoteDTO[];
  startDate: string;
  endDate: string;
  location: string;
  coverages: string[];
  deductibleAmount: number;
}

export interface EquipmentQuoteResponse {
  quoteId: string;
  projectId?: number;
  totalInsuredValue: number;
  durationDays: number;
  startDate: string;
  endDate: string;
  basePremium: number;
  riskAdjustment: number;
  deductibleDiscount: number;
  netPremium: number;
  taxAmount: number;
  totalPayable: number;
  coveredPerils: string[];
  termsSummary: string[];
}

export interface IncomeQuoteRequest {
  userId: number;
  averageMonthlyIncome: number;
  requestedMonthlyBenefit: number;
  benefitPeriodMonths: number;
  profession: string;
  experienceYears: number;
  coveredEventTypes: string[];
}

export interface IncomeQuoteResponse {
  quoteId: string;
  userId: number;
  monthlyBenefit: number;
  benefitPeriodMonths: number;
  maxPotentialBenefit: number;
  policyStartDate: string;
  policyEndDate: string;
  annualBasePremium: number;
  riskAdjustment: number;
  taxAmount: number;
  totalPayable: number;
  coveredEvents: string[];
  exclusions: string[];
  underwritingNote: string;
}
