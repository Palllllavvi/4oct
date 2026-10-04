import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RiskService } from '../../services/risk.service';
import { IncomeQuoteRequest, IncomeQuoteResponse } from '../../models/risk.model';
import { AuthService } from '../../../../core/services/auth.service';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { PolicyRequestService } from '../../../policies/services/policy-request.service';
import { IncomePolicyRequest } from '../../../policies/models/policy-request.model';

@Component({
  selector: 'app-income-quote',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSnackBarModule,
    CurrencyFormatPipe
  ],
  templateUrl: './income-quote.component.html',
  styleUrls: ['./income-quote.component.css']
})
export class IncomeQuoteComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly riskService = inject(RiskService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly policyRequestService = inject(PolicyRequestService);
  private readonly snackBar = inject(MatSnackBar);

  quoteForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  quoteResult: IncomeQuoteResponse | null = null;
  errorMessage: string | null = null;
  requestSubmitted = false;

  get isFreelancer(): boolean {
    const role = this.authService.getUserRole();
    return role === 'ROLE_FREELANCER' || role === 'FREELANCER';
  }

  get isUnderwriter(): boolean {
    const role = this.authService.getUserRole();
    return role === 'ROLE_UNDERWRITER' || role === 'ROLE_ADMIN';
  }

  availableEvents = ['CLIENT_BANKRUPTCY', 'PROJECT_CANCELLATION', 'NON_PAYMENT', 'DISPUTED_DELIVERY'];

  ngOnInit(): void {
    const user = this.authService.currentUser();
    const userId = this.authService.getUserId() || 1;

    this.quoteForm = this.fb.group({
      userId: [userId, Validators.required],
      profession: [user?.profession || 'Software Developer', Validators.required],
      experienceYears: [user?.experienceYears || 5, [Validators.required, Validators.min(0)]],
      averageMonthlyIncome: [user?.averageMonthlyIncome || 5000, [Validators.required, Validators.min(500)]],
      requestedMonthlyBenefit: [3500, [Validators.required, Validators.min(100)]],
      benefitPeriodMonths: [6, [Validators.required, Validators.min(1), Validators.max(24)]],
      coveredEventTypes: [['CLIENT_BANKRUPTCY', 'PROJECT_CANCELLATION'], Validators.required]
    });
  }

  calculateQuote(): void {
    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const request: IncomeQuoteRequest = this.quoteForm.value;

    this.riskService.getIncomeQuote(request).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.data) {
          this.quoteResult = res.data;
        } else {
          this.errorMessage = res?.message || 'Failed to generate income quote';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Error generating quote. Ensure Gateway is reachable at http://localhost:9090';
      }
    });
  }

  /**
   * Freelancer submits an income assurance policy application.
   */
  submitPolicyRequest(): void {
    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      return;
    }

    const user = this.authService.currentUser();
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'Unable to identify your user. Please log in again.';
      return;
    }

    this.isSubmitting = true;
    const formVal = this.quoteForm.value;

    if (!this.quoteResult) {
      const request: IncomeQuoteRequest = formVal;
      this.riskService.getIncomeQuote(request).subscribe({
        next: (res) => {
          if (res && res.data) {
            this.quoteResult = res.data;
          }
          this.doSubmitRequest(userId, user?.name || 'Freelancer', user?.email || '', formVal);
        },
        error: () => {
          this.doSubmitRequest(userId, user?.name || 'Freelancer', user?.email || '', formVal);
        }
      });
    } else {
      this.doSubmitRequest(userId, user?.name || 'Freelancer', user?.email || '', formVal);
    }
  }

  private doSubmitRequest(userId: number, name: string, email: string, formVal: any): void {
    const policyRequest: IncomePolicyRequest = {
      id: this.policyRequestService.generateId(),
      type: 'INCOME',
      status: 'PENDING',
      freelancerId: userId,
      freelancerName: name,
      freelancerEmail: email,
      submittedAt: new Date().toISOString(),
      profession: formVal.profession,
      experienceYears: formVal.experienceYears,
      averageMonthlyIncome: formVal.averageMonthlyIncome,
      requestedMonthlyBenefit: formVal.requestedMonthlyBenefit,
      benefitPeriodMonths: formVal.benefitPeriodMonths,
      coveredEventTypes: formVal.coveredEventTypes,
      quoteData: this.quoteResult
    };

    this.policyRequestService.submitRequest(policyRequest);
    this.isSubmitting = false;
    this.requestSubmitted = true;

    this.snackBar.open(
      '✅ Income assurance application submitted! The underwriter will review it shortly.',
      'View My Requests',
      { duration: 5000, panelClass: ['success-snackbar'] }
    ).onAction().subscribe(() => {
      this.router.navigate(['/policies/my-requests']);
    });
  }

  proceedToIssue(): void {
    this.router.navigate(['/policies/income/issue']);
  }
}
