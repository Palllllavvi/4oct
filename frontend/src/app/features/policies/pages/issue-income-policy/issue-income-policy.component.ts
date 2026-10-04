import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PolicyService } from '../../services/policy.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { IssueIncomeAssurancePolicyRequest } from '../../models/policy.model';

@Component({
  selector: 'app-issue-income-policy',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './issue-income-policy.component.html',
  styleUrls: ['./issue-income-policy.component.css']
})
export class IssueIncomePolicyComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly policyService = inject(PolicyService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  policyForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  readonly terminationTypes = [
    { key: 'CLIENT_INSOLVENCY', label: 'Client Insolvency / Bankruptcy' },
    { key: 'CONTRACT_BREACH', label: 'Client Unilateral Contract Breach' },
    { key: 'MEDICAL_INCAPACITY', label: 'Medical Incapacity / Disability' },
    { key: 'FORCE_MAJEURE', label: 'Project Cancellation (Force Majeure)' }
  ];

  selectedTerminationTypes: Set<string> = new Set([
    'CLIENT_INSOLVENCY',
    'CONTRACT_BREACH',
    'MEDICAL_INCAPACITY'
  ]);

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    if (role !== 'ROLE_UNDERWRITER' && role !== 'ROLE_ADMIN') {
      this.router.navigate(['/policies/income']);
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    this.policyForm = this.fb.group({
      userId: [null, [Validators.required, Validators.min(1)]],
      freelancerName: ['', [Validators.required]],
      freelancerEmail: ['', [Validators.required, Validators.email]],
      startDate: [today, [Validators.required]],
      monthlyIncome: [4500, [Validators.required, Validators.min(500)]],
      benefitMonths: [3, [Validators.required, Validators.min(1), Validators.max(6)]]
    });
  }

  toggleTerminationType(key: string, checked: boolean): void {
    if (checked) {
      this.selectedTerminationTypes.add(key);
    } else {
      this.selectedTerminationTypes.delete(key);
    }
  }

  get calculatedTotalBenefit(): number {
    const monthly = this.policyForm?.get('monthlyIncome')?.value || 0;
    const months = this.policyForm?.get('benefitMonths')?.value || 0;
    return monthly * months;
  }

  onSubmit(): void {
    if (this.policyForm.invalid || this.selectedTerminationTypes.size === 0) {
      this.policyForm.markAllAsTouched();
      if (this.selectedTerminationTypes.size === 0) {
        this.errorMessage = 'Please select at least one covered termination event type.';
      }
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const request: IssueIncomeAssurancePolicyRequest = {
      userId: Number(this.policyForm.value.userId),
      freelancerName: this.policyForm.value.freelancerName,
      freelancerEmail: this.policyForm.value.freelancerEmail,
      startDate: this.policyForm.value.startDate,
      monthlyIncome: Number(this.policyForm.value.monthlyIncome),
      benefitMonths: Number(this.policyForm.value.benefitMonths),
      coveredTerminationTypes: Array.from(this.selectedTerminationTypes).join(',')
    };

    this.policyService.issueIncomePolicy(request).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success && response.data) {
          this.notificationService.showSuccess(
            `Income assurance policy issued: ${response.data.policyNumber}`
          );
          this.router.navigate(['/policies/income']);
        } else {
          this.errorMessage = response.message || 'Failed to issue income policy.';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Error underwriting income policy.';
        this.notificationService.showError(this.errorMessage!);
      }
    });
  }
}
