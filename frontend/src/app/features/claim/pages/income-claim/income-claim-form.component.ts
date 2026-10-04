import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ClaimService } from '../../services/claim.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { SubmitIncomeClaimRequest, TerminationType } from '../../models/claim.model';

@Component({
  selector: 'app-income-claim-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './income-claim-form.component.html',
  styleUrls: ['./income-claim-form.component.css']
})
export class IncomeClaimFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly claimService = inject(ClaimService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  claimForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  readonly terminationTypes = [
    { value: TerminationType.CLIENT_INSOLVENCY, label: 'Client Insolvency / Bankruptcy' },
    { value: TerminationType.CONTRACT_BREACH, label: 'Client Contract Breach / Default' },
    { value: TerminationType.MEDICAL_INCAPACITY, label: 'Medical Incapacity / Disability' },
    { value: TerminationType.FORCE_MAJEURE, label: 'Project Cancellation (Force Majeure)' },
    { value: TerminationType.CLIENT_DEFAULT, label: 'Client Non-Payment / Ghosting' },
    { value: TerminationType.OTHER, label: 'Other Involuntary Loss' }
  ];

  get isMedical(): boolean {
    return this.claimForm?.get('terminationType')?.value === TerminationType.MEDICAL_INCAPACITY;
  }

  get totalClaimCalculated(): number {
    const monthly = this.claimForm?.get('monthlyBenefitClaimed')?.value || 0;
    const months = this.claimForm?.get('benefitMonthsClaimed')?.value || 0;
    return monthly * months;
  }

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    if (role !== 'ROLE_FREELANCER' && role !== 'ROLE_ADMIN') {
      this.router.navigate(['/claims']);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const initialPolicyNumber = this.route.snapshot.queryParamMap.get('policyNumber') || '';
    const initialMonthlyIncome = this.route.snapshot.queryParamMap.get('monthlyIncome');
    const user = this.authService.currentUser();

    this.claimForm = this.fb.group({
      policyNumber: [initialPolicyNumber, [Validators.required]],
      freelancerName: [user?.name || '', [Validators.required]],
      freelancerEmail: [user?.email || '', [Validators.required, Validators.email]],
      terminationType: [TerminationType.CLIENT_INSOLVENCY, [Validators.required]],
      terminationDate: [today, [Validators.required]],
      contractingClientName: ['', [Validators.required]],
      terminationDescription: ['', [Validators.required, Validators.minLength(20)]],
      medicalCondition: [''],
      treatingPhysician: [''],
      incapacityStartDate: [''],
      monthlyBenefitClaimed: [initialMonthlyIncome ? Number(initialMonthlyIncome) : null, [Validators.required, Validators.min(100)]],
      benefitMonthsClaimed: [1, [Validators.required, Validators.min(1), Validators.max(6)]],
      documentRefs: ['']
    });
  }

  onSubmit(): void {
    if (this.claimForm.invalid) {
      this.claimForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const userId = this.authService.getUserId() || undefined;

    const payload: SubmitIncomeClaimRequest = {
      policyNumber: this.claimForm.value.policyNumber,
      userId,
      freelancerName: this.claimForm.value.freelancerName,
      freelancerEmail: this.claimForm.value.freelancerEmail,
      terminationType: this.claimForm.value.terminationType,
      terminationDate: this.claimForm.value.terminationDate,
      contractingClientName: this.claimForm.value.contractingClientName,
      terminationDescription: this.claimForm.value.terminationDescription,
      medicalCondition: this.claimForm.value.medicalCondition || undefined,
      treatingPhysician: this.claimForm.value.treatingPhysician || undefined,
      incapacityStartDate: this.claimForm.value.incapacityStartDate || undefined,
      monthlyBenefitClaimed: Number(this.claimForm.value.monthlyBenefitClaimed),
      benefitMonthsClaimed: Number(this.claimForm.value.benefitMonthsClaimed),
      documentRefs: this.claimForm.value.documentRefs || undefined
    };

    this.claimService.submitIncomeClaim(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success && response.data) {
          this.notificationService.showSuccess(
            `Income claim filed: ${response.data.claimNumber}`
          );
          this.router.navigate(['/claims']);
        } else {
          this.errorMessage = response.message || 'Failed to file income claim.';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Error submitting income claim.';
        this.notificationService.showError(this.errorMessage!);
      }
    });
  }
}
