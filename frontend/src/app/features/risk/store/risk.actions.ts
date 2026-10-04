import { createAction, props } from '@ngrx/store';
import {
  EquipmentQuoteRequest,
  EquipmentQuoteResponse,
  IncomeQuoteRequest,
  IncomeQuoteResponse
} from '../models/risk.model';

// ── Equipment Quote ──────────────────────────────────────────────────────────
export const getEquipmentQuote = createAction(
  '[Risk] Get Equipment Quote',
  props<{ request: EquipmentQuoteRequest }>()
);

export const getEquipmentQuoteSuccess = createAction(
  '[Risk] Get Equipment Quote Success',
  props<{ quote: EquipmentQuoteResponse }>()
);

export const getEquipmentQuoteFailure = createAction(
  '[Risk] Get Equipment Quote Failure',
  props<{ error: string }>()
);

// ── Income Quote ─────────────────────────────────────────────────────────────
export const getIncomeQuote = createAction(
  '[Risk] Get Income Quote',
  props<{ request: IncomeQuoteRequest }>()
);

export const getIncomeQuoteSuccess = createAction(
  '[Risk] Get Income Quote Success',
  props<{ quote: IncomeQuoteResponse }>()
);

export const getIncomeQuoteFailure = createAction(
  '[Risk] Get Income Quote Failure',
  props<{ error: string }>()
);

export const clearRiskError = createAction('[Risk] Clear Error');
export const clearQuotes = createAction('[Risk] Clear Quotes');
