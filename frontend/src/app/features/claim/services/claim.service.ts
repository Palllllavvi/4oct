import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import {
  EquipmentClaim,
  IncomeClaim,
  ReviewClaimRequest,
  SubmitEquipmentClaimRequest,
  SubmitIncomeClaimRequest
} from '../models/claim.model';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/claims`;

  // ── Equipment Claims ───────────────────────────────────────────────

  /**
   * POST /api/claims/equipment
   */
  submitEquipmentClaim(request: SubmitEquipmentClaimRequest): Observable<ApiResponse<EquipmentClaim>> {
    return this.http.post<ApiResponse<EquipmentClaim>>(`${this.baseUrl}/equipment`, request);
  }

  /**
   * GET /api/claims/equipment
   */
  getAllEquipmentClaims(): Observable<ApiResponse<EquipmentClaim[]>> {
    return this.http.get<ApiResponse<EquipmentClaim[]>>(`${this.baseUrl}/equipment`);
  }

  /**
   * GET /api/claims/equipment/user/{userId}
   */
  getEquipmentClaimsForUser(userId: number | string): Observable<ApiResponse<EquipmentClaim[]>> {
    return this.http.get<ApiResponse<EquipmentClaim[]>>(`${this.baseUrl}/equipment/user/${userId}`);
  }

  /**
   * GET /api/claims/equipment/{id}
   */
  getEquipmentClaimById(id: number | string): Observable<ApiResponse<EquipmentClaim>> {
    return this.http.get<ApiResponse<EquipmentClaim>>(`${this.baseUrl}/equipment/${id}`);
  }

  /**
   * GET /api/claims/equipment/status/{status}
   */
  getEquipmentClaimsByStatus(status: string): Observable<ApiResponse<EquipmentClaim[]>> {
    return this.http.get<ApiResponse<EquipmentClaim[]>>(`${this.baseUrl}/equipment/status/${status}`);
  }

  /**
   * PATCH /api/claims/equipment/{id}/review
   */
  reviewEquipmentClaim(id: number | string, request: ReviewClaimRequest): Observable<ApiResponse<EquipmentClaim>> {
    return this.http.patch<ApiResponse<EquipmentClaim>>(`${this.baseUrl}/equipment/${id}/review`, request);
  }

  // ── Income Claims ──────────────────────────────────────────────────

  /**
   * POST /api/claims/income
   */
  submitIncomeClaim(request: SubmitIncomeClaimRequest): Observable<ApiResponse<IncomeClaim>> {
    return this.http.post<ApiResponse<IncomeClaim>>(`${this.baseUrl}/income`, request);
  }

  /**
   * GET /api/claims/income
   */
  getAllIncomeClaims(): Observable<ApiResponse<IncomeClaim[]>> {
    return this.http.get<ApiResponse<IncomeClaim[]>>(`${this.baseUrl}/income`);
  }

  /**
   * GET /api/claims/income/user/{userId}
   */
  getIncomeClaimsForUser(userId: number | string): Observable<ApiResponse<IncomeClaim[]>> {
    return this.http.get<ApiResponse<IncomeClaim[]>>(`${this.baseUrl}/income/user/${userId}`);
  }

  /**
   * GET /api/claims/income/{id}
   */
  getIncomeClaimById(id: number | string): Observable<ApiResponse<IncomeClaim>> {
    return this.http.get<ApiResponse<IncomeClaim>>(`${this.baseUrl}/income/${id}`);
  }

  /**
   * GET /api/claims/income/status/{status}
   */
  getIncomeClaimsByStatus(status: string): Observable<ApiResponse<IncomeClaim[]>> {
    return this.http.get<ApiResponse<IncomeClaim[]>>(`${this.baseUrl}/income/status/${status}`);
  }

  /**
   * PATCH /api/claims/income/{id}/review
   */
  reviewIncomeClaim(id: number | string, request: ReviewClaimRequest): Observable<ApiResponse<IncomeClaim>> {
    return this.http.patch<ApiResponse<IncomeClaim>>(`${this.baseUrl}/income/${id}/review`, request);
  }
}
