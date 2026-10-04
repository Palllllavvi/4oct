import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FreelancerStats {
  totalProjects: number;
  activePolicies: number;
  submittedClaims: number;
}

export interface UnderwriterStats {
  policiesIssued: number;
  equipmentPolicies: number;
  incomePolicies: number;
}

export interface AssessorStats {
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
}

export interface AdminStats {
  users: number;
  projects: number;
  policies: number;
  claims: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Fetch statistics for Freelancers:
   * - Total Projects
   * - Active Policies (Equipment + Income)
   * - Submitted Claims (Equipment + Income)
   */
  getFreelancerStats(userId?: number | null): Observable<FreelancerStats> {
    const projects$ = this.http.get<any>(`${this.baseUrl}/api/projects`).pipe(
      map((res) => (Array.isArray(res?.data) ? res.data.length : Array.isArray(res) ? res.length : 0)),
      catchError(() => of(0))
    );

    const userParam = userId ? `/user/${userId}` : '';

    const equipmentPolicies$ = this.http.get<any>(`${this.baseUrl}/api/policies/equipment${userParam}`).pipe(
      map((res) => (Array.isArray(res?.data) ? res.data.length : Array.isArray(res) ? res.length : 0)),
      catchError(() => of(0))
    );

    const incomePolicies$ = this.http.get<any>(`${this.baseUrl}/api/policies/income${userParam}`).pipe(
      map((res) => (Array.isArray(res?.data) ? res.data.length : Array.isArray(res) ? res.length : 0)),
      catchError(() => of(0))
    );

    const equipmentClaims$ = this.http.get<any>(`${this.baseUrl}/api/claims/equipment${userParam}`).pipe(
      map((res) => (Array.isArray(res?.data) ? res.data.length : Array.isArray(res) ? res.length : 0)),
      catchError(() => of(0))
    );

    const incomeClaims$ = this.http.get<any>(`${this.baseUrl}/api/claims/income${userParam}`).pipe(
      map((res) => (Array.isArray(res?.data) ? res.data.length : Array.isArray(res) ? res.length : 0)),
      catchError(() => of(0))
    );

    return forkJoin({
      totalProjects: projects$,
      equipPol: equipmentPolicies$,
      incPol: incomePolicies$,
      equipClaims: equipmentClaims$,
      incClaims: incomeClaims$
    }).pipe(
      map((result) => ({
        totalProjects: result.totalProjects,
        activePolicies: result.equipPol + result.incPol,
        submittedClaims: result.equipClaims + result.incClaims
      }))
    );
  }

  /**
   * Fetch statistics for Underwriters:
   * - Policies Issued
   * - Equipment Policies
   * - Income Policies
   */
  getUnderwriterStats(): Observable<UnderwriterStats> {
    const equipmentPolicies$ = this.http.get<any>(`${this.baseUrl}/api/policies/equipment`).pipe(
      map((res) => (Array.isArray(res?.data) ? res.data.length : Array.isArray(res) ? res.length : 0)),
      catchError(() => of(0))
    );

    const incomePolicies$ = this.http.get<any>(`${this.baseUrl}/api/policies/income`).pipe(
      map((res) => (Array.isArray(res?.data) ? res.data.length : Array.isArray(res) ? res.length : 0)),
      catchError(() => of(0))
    );

    return forkJoin({
      equipmentPolicies: equipmentPolicies$,
      incomePolicies: incomePolicies$
    }).pipe(
      map((result) => ({
        policiesIssued: result.equipmentPolicies + result.incomePolicies,
        equipmentPolicies: result.equipmentPolicies,
        incomePolicies: result.incomePolicies
      }))
    );
  }

  /**
   * Fetch statistics for Assessors:
   * - Pending Claims
   * - Approved Claims
   * - Rejected Claims
   */
  getAssessorStats(): Observable<AssessorStats> {
    const fetchStatusCount = (type: 'equipment' | 'income', status: string) =>
      this.http.get<any>(`${this.baseUrl}/api/claims/${type}/status/${status}`).pipe(
        map((res) => (Array.isArray(res?.data) ? res.data.length : Array.isArray(res) ? res.length : 0)),
        catchError(() => of(0))
      );

    return forkJoin({
      submittedEquip:   fetchStatusCount('equipment', 'SUBMITTED'),
      submittedInc:     fetchStatusCount('income',    'SUBMITTED'),
      underReviewEquip: fetchStatusCount('equipment', 'UNDER_REVIEW'),
      underReviewInc:   fetchStatusCount('income',    'UNDER_REVIEW'),
      approvedEquip:    fetchStatusCount('equipment', 'APPROVED'),
      approvedInc:      fetchStatusCount('income',    'APPROVED'),
      settledEquip:     fetchStatusCount('equipment', 'SETTLED'),
      settledInc:       fetchStatusCount('income',    'SETTLED'),
      rejectedEquip:    fetchStatusCount('equipment', 'REJECTED'),
      rejectedInc:      fetchStatusCount('income',    'REJECTED')
    }).pipe(
      map((result) => ({
        pendingClaims:  result.submittedEquip + result.submittedInc + result.underReviewEquip + result.underReviewInc,
        approvedClaims: result.approvedEquip  + result.approvedInc  + result.settledEquip  + result.settledInc,
        rejectedClaims: result.rejectedEquip  + result.rejectedInc
      }))
    );
  }

  /**
   * Fetch statistics for Admins:
   * - Users
   * - Projects
   * - Policies
   * - Claims
   */
  getAdminStats(): Observable<AdminStats> {
    const users$ = this.http.get<any>(`${this.baseUrl}/api/users`).pipe(
      map((res) => (Array.isArray(res?.data) ? res.data.length : Array.isArray(res) ? res.length : 0)),
      catchError(() => of(0))
    );

    const projects$ = this.http.get<any>(`${this.baseUrl}/api/projects/all`).pipe(
      map((res) => (Array.isArray(res?.data) ? res.data.length : Array.isArray(res) ? res.length : 0)),
      catchError(() =>
        this.http.get<any>(`${this.baseUrl}/api/projects`).pipe(
          map((res) => (Array.isArray(res?.data) ? res.data.length : Array.isArray(res) ? res.length : 0)),
          catchError(() => of(0))
        )
      )
    );

    const equipPolicies$ = this.http.get<any>(`${this.baseUrl}/api/policies/equipment`).pipe(
      map((res) => (Array.isArray(res?.data) ? res.data.length : Array.isArray(res) ? res.length : 0)),
      catchError(() => of(0))
    );

    const incPolicies$ = this.http.get<any>(`${this.baseUrl}/api/policies/income`).pipe(
      map((res) => (Array.isArray(res?.data) ? res.data.length : Array.isArray(res) ? res.length : 0)),
      catchError(() => of(0))
    );

    const equipClaims$ = this.http.get<any>(`${this.baseUrl}/api/claims/equipment`).pipe(
      map((res) => (Array.isArray(res?.data) ? res.data.length : Array.isArray(res) ? res.length : 0)),
      catchError(() => of(0))
    );

    const incClaims$ = this.http.get<any>(`${this.baseUrl}/api/claims/income`).pipe(
      map((res) => (Array.isArray(res?.data) ? res.data.length : Array.isArray(res) ? res.length : 0)),
      catchError(() => of(0))
    );

    return forkJoin({
      users: users$,
      projects: projects$,
      equipPol: equipPolicies$,
      incPol: incPolicies$,
      equipClaims: equipClaims$,
      incClaims: incClaims$
    }).pipe(
      map((result) => ({
        users: result.users,
        projects: result.projects,
        policies: result.equipPol + result.incPol,
        claims: result.equipClaims + result.incClaims
      }))
    );
  }
}
