import { createReducer, on } from '@ngrx/store';
import { initialRiskState, RiskState } from './risk.state';
import {
  clearQuotes,
  clearRiskError,
  getEquipmentQuote,
  getEquipmentQuoteFailure,
  getEquipmentQuoteSuccess,
  getIncomeQuote,
  getIncomeQuoteFailure,
  getIncomeQuoteSuccess
} from './risk.actions';

export const riskReducer = createReducer(
  initialRiskState,

  // ── Equipment Quote ────────────────────────────────────────────────────────
  on(getEquipmentQuote, (state): RiskState => ({
    ...state,
    isLoadingEquipmentQuote: true,
    error: null
  })),
  on(getEquipmentQuoteSuccess, (state, { quote }): RiskState => ({
    ...state,
    equipmentQuote: quote,
    isLoadingEquipmentQuote: false,
    error: null
  })),
  on(getEquipmentQuoteFailure, (state, { error }): RiskState => ({
    ...state,
    isLoadingEquipmentQuote: false,
    error
  })),

  // ── Income Quote ───────────────────────────────────────────────────────────
  on(getIncomeQuote, (state): RiskState => ({
    ...state,
    isLoadingIncomeQuote: true,
    error: null
  })),
  on(getIncomeQuoteSuccess, (state, { quote }): RiskState => ({
    ...state,
    incomeQuote: quote,
    isLoadingIncomeQuote: false,
    error: null
  })),
  on(getIncomeQuoteFailure, (state, { error }): RiskState => ({
    ...state,
    isLoadingIncomeQuote: false,
    error
  })),

  on(clearRiskError, (state): RiskState => ({
    ...state,
    error: null
  })),
  on(clearQuotes, (state): RiskState => ({
    ...state,
    equipmentQuote: null,
    incomeQuote: null
  }))
);
