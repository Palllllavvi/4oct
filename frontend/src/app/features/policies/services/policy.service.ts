import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import {
  EquipmentPolicy,
  IncomeAssurancePolicy,
  IssueEquipmentPolicyRequest,
  IssueIncomeAssurancePolicyRequest
} from '../models/policy.model';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/policies`;

  // ── Equipment Policies ───────────────────────────────────────────────

  /**
   * POST /api/policies/equipment
   */
  issueEquipmentPolicy(request: IssueEquipmentPolicyRequest): Observable<ApiResponse<EquipmentPolicy>> {
    return this.http.post<ApiResponse<EquipmentPolicy>>(`${this.baseUrl}/equipment`, request);
  }

  /**
   * GET /api/policies/equipment
   */
  getAllEquipmentPolicies(): Observable<ApiResponse<EquipmentPolicy[]>> {
    return this.http.get<ApiResponse<EquipmentPolicy[]>>(`${this.baseUrl}/equipment`);
  }

  /**
   * GET /api/policies/equipment/user/{userId}
   */
  getEquipmentPoliciesForUser(userId: number | string): Observable<ApiResponse<EquipmentPolicy[]>> {
    return this.http.get<ApiResponse<EquipmentPolicy[]>>(`${this.baseUrl}/equipment/user/${userId}`);
  }

  /**
   * GET /api/policies/equipment/{id}
   */
  getEquipmentPolicyById(id: number | string): Observable<ApiResponse<EquipmentPolicy>> {
    return this.http.get<ApiResponse<EquipmentPolicy>>(`${this.baseUrl}/equipment/${id}`);
  }

  /**
   * GET /api/policies/equipment/number/{policyNumber}
   */
  getEquipmentPolicyByNumber(policyNumber: string): Observable<ApiResponse<EquipmentPolicy>> {
    return this.http.get<ApiResponse<EquipmentPolicy>>(`${this.baseUrl}/equipment/number/${policyNumber}`);
  }

  /**
   * PATCH /api/policies/equipment/{id}/cancel
   */
  cancelEquipmentPolicy(id: number | string): Observable<ApiResponse<EquipmentPolicy>> {
    return this.http.patch<ApiResponse<EquipmentPolicy>>(`${this.baseUrl}/equipment/${id}/cancel`, {});
  }

  // ── Income Assurance Policies ──────────────────────────────────────────

  /**
   * POST /api/policies/income
   */
  issueIncomePolicy(request: IssueIncomeAssurancePolicyRequest): Observable<ApiResponse<IncomeAssurancePolicy>> {
    return this.http.post<ApiResponse<IncomeAssurancePolicy>>(`${this.baseUrl}/income`, request);
  }

  /**
   * GET /api/policies/income
   */
  getAllIncomePolicies(): Observable<ApiResponse<IncomeAssurancePolicy[]>> {
    return this.http.get<ApiResponse<IncomeAssurancePolicy[]>>(`${this.baseUrl}/income`);
  }

  /**
   * GET /api/policies/income/user/{userId}
   */
  getIncomePoliciesForUser(userId: number | string): Observable<ApiResponse<IncomeAssurancePolicy[]>> {
    return this.http.get<ApiResponse<IncomeAssurancePolicy[]>>(`${this.baseUrl}/income/user/${userId}`);
  }

  /**
   * GET /api/policies/income/{id}
   */
  getIncomePolicyById(id: number | string): Observable<ApiResponse<IncomeAssurancePolicy>> {
    return this.http.get<ApiResponse<IncomeAssurancePolicy>>(`${this.baseUrl}/income/${id}`);
  }

  /**
   * GET /api/policies/income/number/{policyNumber}
   */
  getIncomePolicyByNumber(policyNumber: string): Observable<ApiResponse<IncomeAssurancePolicy>> {
    return this.http.get<ApiResponse<IncomeAssurancePolicy>>(`${this.baseUrl}/income/number/${policyNumber}`);
  }

  /**
   * PATCH /api/policies/income/{id}/cancel
   */
  cancelIncomePolicy(id: number | string): Observable<ApiResponse<IncomeAssurancePolicy>> {
    return this.http.patch<ApiResponse<IncomeAssurancePolicy>>(`${this.baseUrl}/income/${id}/cancel`, {});
  }
}
