import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RiskService } from '../services/risk.service';
import {
  getEquipmentQuote,
  getEquipmentQuoteFailure,
  getEquipmentQuoteSuccess,
  getIncomeQuote,
  getIncomeQuoteFailure,
  getIncomeQuoteSuccess
} from './risk.actions';

@Injectable()
export class RiskEffects {
  private readonly actions$ = inject(Actions);
  private readonly riskService = inject(RiskService);

  getEquipmentQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getEquipmentQuote),
      switchMap(({ request }) =>
        this.riskService.getEquipmentQuote(request).pipe(
          map((res) => {
            if (res && res.data) {
              return getEquipmentQuoteSuccess({ quote: res.data });
            }
            return getEquipmentQuoteFailure({ error: res?.message || 'Failed to calculate equipment quote' });
          }),
          catchError((err) =>
            of(getEquipmentQuoteFailure({ error: err?.error?.message || 'Error communicating with Risk service' }))
          )
        )
      )
    )
  );

  getIncomeQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getIncomeQuote),
      switchMap(({ request }) =>
        this.riskService.getIncomeQuote(request).pipe(
          map((res) => {
            if (res && res.data) {
              return getIncomeQuoteSuccess({ quote: res.data });
            }
            return getIncomeQuoteFailure({ error: res?.message || 'Failed to calculate income quote' });
          }),
          catchError((err) =>
            of(getIncomeQuoteFailure({ error: err?.error?.message || 'Error communicating with Risk service' }))
          )
        )
      )
    )
  );
}
