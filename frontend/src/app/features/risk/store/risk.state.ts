import { EquipmentQuoteResponse, IncomeQuoteResponse } from '../models/risk.model';

export interface RiskState {
  equipmentQuote: EquipmentQuoteResponse | null;
  incomeQuote: IncomeQuoteResponse | null;
  isLoadingEquipmentQuote: boolean;
  isLoadingIncomeQuote: boolean;
  error: string | null;
}

export const initialRiskState: RiskState = {
  equipmentQuote: null,
  incomeQuote: null,
  isLoadingEquipmentQuote: false,
  isLoadingIncomeQuote: false,
  error: null
};
