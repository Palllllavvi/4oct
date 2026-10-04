import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  PolicyRequest,
  PolicyRequestStatus,
  EquipmentPolicyRequest,
  IncomePolicyRequest
} from '../models/policy-request.model';

const STORAGE_KEY = 'freelance_shield_policy_requests';

/**
 * PolicyRequestService manages the lifecycle of freelancer policy applications.
 * Requests are persisted in localStorage so both the freelancer (who submitted them)
 * and the underwriter (who reviews them) see a consistent state.
 */
@Injectable({
  providedIn: 'root'
})
export class PolicyRequestService {

  private readonly requestsSubject = new BehaviorSubject<PolicyRequest[]>(this.loadAll());
  /** Observable stream of all policy requests */
  readonly requests$ = this.requestsSubject.asObservable();

  // ── CRUD ─────────────────────────────────────────────────────────────────

  /** Persist a new policy request submitted by a freelancer */
  submitRequest(request: EquipmentPolicyRequest | IncomePolicyRequest): void {
    const all = this.loadAll();
    all.unshift(request);
    this.saveAll(all);
  }

  /** Return all requests (latest first) */
  getAll(): PolicyRequest[] {
    return this.loadAll();
  }

  /** Return requests for a specific freelancer */
  getByFreelancer(freelancerId: number): PolicyRequest[] {
    return this.loadAll().filter(r => Number(r.freelancerId) === Number(freelancerId));
  }

  /** Return all pending requests (for underwriter queue) */
  getPending(): PolicyRequest[] {
    return this.loadAll().filter(r => r.status === 'PENDING');
  }

  /** Find a single request by its ID */
  getById(id: string): PolicyRequest | undefined {
    return this.loadAll().find(r => r.id === id);
  }

  /**
   * Update a request's status and optionally attach quote data or issued policy info.
   * Called by the underwriter after reviewing the risk quote.
   */
  updateRequest(id: string, changes: Partial<PolicyRequest>): void {
    const all = this.loadAll().map(r =>
      r.id === id ? ({ ...r, ...changes } as PolicyRequest) : r
    );
    this.saveAll(all);
  }

  /**
   * Approve a request — sets status to APPROVED and stores the issued policy details.
   */
  approveRequest(id: string, policyId: number, policyNumber: string): void {
    this.updateRequest(id, {
      status: 'APPROVED',
      reviewedAt: new Date().toISOString(),
      issuedPolicyId: policyId,
      issuedPolicyNumber: policyNumber
    });
  }

  /**
   * Disapprove a request — sets status to DISAPPROVED and stores the review note.
   */
  disapproveRequest(id: string, reviewNote: string): void {
    this.updateRequest(id, {
      status: 'DISAPPROVED',
      reviewedAt: new Date().toISOString(),
      reviewNote
    });
  }

  /** Attach quote data returned from the risk engine to a pending request */
  attachQuote(id: string, quoteData: any): void {
    this.updateRequest(id, { quoteData });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private loadAll(): PolicyRequest[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveAll(requests: PolicyRequest[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    this.requestsSubject.next(requests);
  }

  /** Generate a simple UUID-like ID */
  generateId(): string {
    return 'req_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
  }

  /** Map PolicyRequestStatus to a CSS class string */
  getStatusClass(status: PolicyRequestStatus): string {
    switch (status) {
      case 'PENDING':    return 'status-pending';
      case 'APPROVED':   return 'status-approved';
      case 'DISAPPROVED': return 'status-disapproved';
      default:           return '';
    }
  }
}
