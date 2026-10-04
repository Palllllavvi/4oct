import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import {
  EquipmentQuoteRequest,
  EquipmentQuoteResponse,
  IncomeQuoteRequest,
  IncomeQuoteResponse
} from '../models/risk.model';

@Injectable({
  providedIn: 'root'
})
export class RiskService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/risk`;

  /**
   * POST /api/risk/equipment-quote
   */
  getEquipmentQuote(request: EquipmentQuoteRequest): Observable<ApiResponse<EquipmentQuoteResponse>> {
    return this.http.post<ApiResponse<EquipmentQuoteResponse>>(`${this.baseUrl}/equipment-quote`, request);
  }

  /**
   * POST /api/risk/income-quote
   */
  getIncomeQuote(request: IncomeQuoteRequest): Observable<ApiResponse<IncomeQuoteResponse>> {
    return this.http.post<ApiResponse<IncomeQuoteResponse>>(`${this.baseUrl}/income-quote`, request);
  }
}
