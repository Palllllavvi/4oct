import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PolicyRequestService } from '../../services/policy-request.service';
import { RiskService } from '../../../risk/services/risk.service';
import { PolicyService } from '../../services/policy.service';
import {
  PolicyRequest,
  EquipmentPolicyRequest,
  IncomePolicyRequest
} from '../../models/policy-request.model';
import {
  EquipmentQuoteRequest,
  IncomeQuoteRequest,
  EquipmentQuoteResponse,
  IncomeQuoteResponse
} from '../../../risk/models/risk.model';
import { IssueEquipmentPolicyRequest, IssueIncomeAssurancePolicyRequest } from '../../models/policy.model';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';

// A flat view-model that combines both request types for template use
interface RequestViewModel {
  // Base fields
  id: string;
  type: 'EQUIPMENT' | 'INCOME';
  status: 'PENDING' | 'APPROVED' | 'DISAPPROVED';
  freelancerId: number;
  freelancerName: string;
  freelancerEmail: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
  quoteData?: any;
  issuedPolicyId?: number;
  issuedPolicyNumber?: string;
  // Equipment fields (optional)
  projectId?: number;
  projectName?: string;
  clientName?: string;
  clientCompanyName?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  deductibleAmount?: number;
  coverages?: string[];
  equipmentList?: any[];
  // Income fields (optional)
  profession?: string;
  experienceYears?: number;
  averageMonthlyIncome?: number;
  requestedMonthlyBenefit?: number;
  benefitPeriodMonths?: number;
  coveredEventTypes?: string[];
  // UI state
  isLoadingQuote?: boolean;
  isProcessing?: boolean;
  showQuote?: boolean;
  disapproveNote?: string;
  showDisapproveInput?: boolean;
}

@Component({
  selector: 'app-underwriter-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    CurrencyFormatPipe
  ],
  templateUrl: './underwriter-requests.component.html',
  styleUrls: ['./underwriter-requests.component.css']
})
export class UnderwriterRequestsComponent implements OnInit {
  private readonly policyRequestService = inject(PolicyRequestService);
  private readonly riskService = inject(RiskService);
  private readonly policyService = inject(PolicyService);
  private readonly snackBar = inject(MatSnackBar);

  selectedTabIndex = 0;
  allRequests: RequestViewModel[] = [];
  pendingRequests: RequestViewModel[] = [];
  approvedRequests: RequestViewModel[] = [];
  disapprovedRequests: RequestViewModel[] = [];

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    const all = this.policyRequestService.getAll() as RequestViewModel[];
    this.allRequests = all;
    this.pendingRequests = all.filter(r => r.status === 'PENDING');
    this.approvedRequests = all.filter(r => r.status === 'APPROVED');
    this.disapprovedRequests = all.filter(r => r.status === 'DISAPPROVED');
  }

  // ── Quote from Risk Engine ─────────────────────────────────────────────────

  getQuote(req: RequestViewModel): void {
    req.isLoadingQuote = true;

    if (req.type === 'EQUIPMENT') {
      const eReq = req as EquipmentPolicyRequest;
      const quoteRequest: EquipmentQuoteRequest = {
        projectId: undefined,
        equipmentList: eReq.equipmentList,
        startDate: eReq.startDate,
        endDate: eReq.endDate,
        location: eReq.location,
        coverages: eReq.coverages,
        deductibleAmount: eReq.deductibleAmount
      };

      this.riskService.getEquipmentQuote(quoteRequest).subscribe({
        next: (res) => {
          req.isLoadingQuote = false;
          if (res?.data) {
            req.quoteData = res.data;
            req.showQuote = true;
            this.policyRequestService.attachQuote(req.id, res.data);
            this.snackBar.open('✅ Equipment quote generated from risk engine', '', { duration: 3000 });
          } else {
            this.snackBar.open('⚠️ Risk engine returned no data', '', { duration: 3000 });
          }
        },
        error: (err) => {
          req.isLoadingQuote = false;
          this.snackBar.open('❌ Risk engine error: ' + (err?.error?.message || 'Gateway unreachable'), '', { duration: 4000 });
        }
      });

    } else {
      const iReq = req as IncomePolicyRequest;
      const quoteRequest: IncomeQuoteRequest = {
        userId: iReq.freelancerId,
        averageMonthlyIncome: iReq.averageMonthlyIncome,
        requestedMonthlyBenefit: iReq.requestedMonthlyBenefit,
        benefitPeriodMonths: iReq.benefitPeriodMonths,
        profession: iReq.profession,
        experienceYears: iReq.experienceYears,
        coveredEventTypes: iReq.coveredEventTypes
      };

      this.riskService.getIncomeQuote(quoteRequest).subscribe({
        next: (res) => {
          req.isLoadingQuote = false;
          if (res?.data) {
            req.quoteData = res.data;
            req.showQuote = true;
            this.policyRequestService.attachQuote(req.id, res.data);
            this.snackBar.open('✅ Income quote generated from risk engine', '', { duration: 3000 });
          } else {
            this.snackBar.open('⚠️ Risk engine returned no data', '', { duration: 3000 });
          }
        },
        error: (err) => {
          req.isLoadingQuote = false;
          this.snackBar.open('❌ Risk engine error: ' + (err?.error?.message || 'Gateway unreachable'), '', { duration: 4000 });
        }
      });
    }
  }

  toggleQuote(req: RequestViewModel): void {
    req.showQuote = !req.showQuote;
  }

  // ── Approve: Issue Policy ──────────────────────────────────────────────────

  approveRequest(req: RequestViewModel): void {
    req.isProcessing = true;

    if (req.type === 'EQUIPMENT') {
      const eReq = req as EquipmentPolicyRequest;
      const quote = req.quoteData as EquipmentQuoteResponse | undefined;

      const issueRequest: IssueEquipmentPolicyRequest = {
        projectId: eReq.projectId || 1,
        userId: eReq.freelancerId,
        projectName: eReq.projectName,
        clientName: eReq.clientName,
        clientCompanyName: eReq.clientCompanyName,
        startDate: typeof eReq.startDate === 'string' ? eReq.startDate.substring(0, 10) : new Date(eReq.startDate).toISOString().substring(0, 10),
        endDate: typeof eReq.endDate === 'string' ? eReq.endDate.substring(0, 10) : new Date(eReq.endDate).toISOString().substring(0, 10),
        insuredValue: quote?.totalInsuredValue || eReq.equipmentList.reduce((s, i) => s + i.declaredValue, 0),
        deductible: eReq.deductibleAmount,
        premium: quote?.totalPayable,
        items: eReq.equipmentList.map(item => ({
          equipmentName: `${item.brand} ${item.model}`,
          serialNumber: item.serialNumber,
          insuredValue: item.declaredValue,
          condition: item.condition
        }))
      };

      this.policyService.issueEquipmentPolicy(issueRequest).subscribe({
        next: (res) => {
          req.isProcessing = false;
          if (res?.data) {
            this.policyRequestService.approveRequest(req.id, res.data.id, res.data.policyNumber);
            this.snackBar.open(`✅ Equipment policy issued: ${res.data.policyNumber}`, 'OK', { duration: 5000 });
            this.loadRequests();
            this.selectedTabIndex = 1; // Switch to Approved tab
          } else {
            req.isProcessing = false;
            this.snackBar.open('⚠️ ' + (res?.message || 'Failed to issue policy'), '', { duration: 4000 });
          }
        },
        error: (err) => {
          req.isProcessing = false;
          this.snackBar.open('❌ ' + (err?.error?.message || 'Error issuing policy'), '', { duration: 4000 });
        }
      });

    } else {
      const iReq = req as IncomePolicyRequest;
      const quote = req.quoteData as IncomeQuoteResponse | undefined;

      const today = new Date().toISOString().split('T')[0];
      const issueRequest: IssueIncomeAssurancePolicyRequest = {
        userId: iReq.freelancerId,
        freelancerName: iReq.freelancerName,
        freelancerEmail: iReq.freelancerEmail,
        startDate: today,
        monthlyIncome: iReq.averageMonthlyIncome,
        benefitMonths: iReq.benefitPeriodMonths,
        annualPremium: quote?.totalPayable,
        coveredTerminationTypes: iReq.coveredEventTypes.join(',')
      };

      this.policyService.issueIncomePolicy(issueRequest).subscribe({
        next: (res) => {
          req.isProcessing = false;
          if (res?.data) {
            this.policyRequestService.approveRequest(req.id, res.data.id, res.data.policyNumber);
            this.snackBar.open(`✅ Income policy issued: ${res.data.policyNumber}`, 'OK', { duration: 5000 });
            this.loadRequests();
            this.selectedTabIndex = 1; // Switch to Approved tab
          } else {
            this.snackBar.open('⚠️ ' + (res?.message || 'Failed to issue policy'), '', { duration: 4000 });
          }
        },
        error: (err) => {
          req.isProcessing = false;
          this.snackBar.open('❌ ' + (err?.error?.message || 'Error issuing policy'), '', { duration: 4000 });
        }
      });
    }
  }

  // ── Disapprove ─────────────────────────────────────────────────────────────

  toggleDisapproveInput(req: RequestViewModel): void {
    req.showDisapproveInput = !req.showDisapproveInput;
    if (!req.disapproveNote) req.disapproveNote = '';
  }

  disapproveRequest(req: RequestViewModel): void {
    const note = req.disapproveNote?.trim() || 'Policy application not approved by underwriter.';
    this.policyRequestService.disapproveRequest(req.id, note);
    this.snackBar.open('Request disapproved and freelancer notified.', 'OK', { duration: 3000 });
    this.loadRequests();
    this.selectedTabIndex = 2; // Switch to Disapproved tab
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  getStatusClass(status: string): string {
    return this.policyRequestService.getStatusClass(status as any);
  }

  getEquipmentTotalValue(req: RequestViewModel): number {
    if (req.type !== 'EQUIPMENT') return 0;
    return (req as EquipmentPolicyRequest).equipmentList?.reduce((s, i) => s + i.declaredValue, 0) || 0;
  }

  asEquipment(req: RequestViewModel): any {
    return req;
  }

  asIncome(req: RequestViewModel): any {
    return req;
  }

  asEquipmentQuote(q: any): EquipmentQuoteResponse { return q; }
  asIncomeQuote(q: any): IncomeQuoteResponse { return q; }
}
