import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgTemplateOutlet, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PolicyRequestService } from '../../services/policy-request.service';
import { AuthService } from '../../../../core/services/auth.service';
import {
  PolicyRequest,
  EquipmentPolicyRequest,
  IncomePolicyRequest
} from '../../models/policy-request.model';

@Component({
  selector: 'app-my-policy-requests',
  standalone: true,
  imports: [
    CommonModule,
    NgTemplateOutlet,
    CurrencyPipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './my-policy-requests.component.html',
  styleUrls: ['./my-policy-requests.component.css']
})
export class MyPolicyRequestsComponent implements OnInit {
  private readonly policyRequestService = inject(PolicyRequestService);
  private readonly authService = inject(AuthService);

  myRequests: PolicyRequest[] = [];
  pending: PolicyRequest[] = [];
  approved: PolicyRequest[] = [];
  disapproved: PolicyRequest[] = [];

  ngOnInit(): void {
    this.policyRequestService.requests$.subscribe(() => {
      this.loadRequests();
    });
  }

  loadRequests(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;
    const all = this.policyRequestService.getByFreelancer(userId);
    this.myRequests = all;
    this.pending = all.filter(r => r.status === 'PENDING');
    this.approved = all.filter(r => r.status === 'APPROVED');
    this.disapproved = all.filter(r => r.status === 'DISAPPROVED');
  }

  asEquipment(req: PolicyRequest): EquipmentPolicyRequest {
    return req as EquipmentPolicyRequest;
  }

  asIncome(req: PolicyRequest): IncomePolicyRequest {
    return req as IncomePolicyRequest;
  }

  getEquipmentTotal(req: PolicyRequest): number {
    if (req.type !== 'EQUIPMENT') return 0;
    return (req as EquipmentPolicyRequest).equipmentList?.reduce((s, i) => s + i.declaredValue, 0) || 0;
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PENDING':     return 'pending_actions';
      case 'APPROVED':    return 'check_circle';
      case 'DISAPPROVED': return 'cancel';
      default:            return 'help';
    }
  }
}
