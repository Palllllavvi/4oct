import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RiskState } from './risk.state';

export const selectRiskState = createFeatureSelector<RiskState>('risk');

export const selectEquipmentQuote = createSelector(
  selectRiskState,
  (state: RiskState) => state?.equipmentQuote
);

export const selectIncomeQuote = createSelector(
  selectRiskState,
  (state: RiskState) => state?.incomeQuote
);

export const selectIsLoadingEquipmentQuote = createSelector(
  selectRiskState,
  (state: RiskState) => state?.isLoadingEquipmentQuote
);

export const selectIsLoadingIncomeQuote = createSelector(
  selectRiskState,
  (state: RiskState) => state?.isLoadingIncomeQuote
);

export const selectRiskError = createSelector(
  selectRiskState,
  (state: RiskState) => state?.error
);
