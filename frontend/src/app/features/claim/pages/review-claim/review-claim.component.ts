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
import { Observable } from 'rxjs';

import { ClaimService } from '../../services/claim.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ApiResponse } from '../../../../core/models/user.model';
import {
  ClaimStatus,
  EquipmentClaim,
  IncomeClaim,
  ReviewClaimRequest
} from '../../models/claim.model';

@Component({
  selector: 'app-review-claim',
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
  templateUrl: './review-claim.component.html',
  styleUrls: ['./review-claim.component.css']
})
export class ReviewClaimComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly claimService = inject(ClaimService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  claimType: 'equipment' | 'income' = 'equipment';
  claimId!: number;

  equipmentClaim: EquipmentClaim | null = null;
  incomeClaim: IncomeClaim | null = null;

  reviewForm!: FormGroup;
  isLoading = true;
  isSubmitting = false;
  errorMessage: string | null = null;

  readonly statuses = [
    { value: ClaimStatus.UNDER_REVIEW, label: 'Mark Under Investigation' },
    { value: ClaimStatus.APPROVED, label: 'Approve Payout' },
    { value: ClaimStatus.SETTLED, label: 'Settle & Close' },
    { value: ClaimStatus.REJECTED, label: 'Reject Claim' }
  ];

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    if (role !== 'ROLE_ASSESSOR' && role !== 'ROLE_ADMIN') {
      this.router.navigate(['/claims']);
      return;
    }

    const url = this.router.url;
    if (url.includes('/income')) {
      this.claimType = 'income';
    } else {
      this.claimType = 'equipment';
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || isNaN(Number(idParam))) {
      this.errorMessage = 'Invalid Claim ID.';
      this.isLoading = false;
      return;
    }

    this.claimId = Number(idParam);

    const currentUser = this.authService.currentUser();
    const defaultAssessorId = currentUser?.email || 'ASSESSOR-' + (currentUser?.id || '01');

    this.reviewForm = this.fb.group({
      status: [ClaimStatus.APPROVED, [Validators.required]],
      approvedAmount: [null],
      assessorNotes: ['', [Validators.required, Validators.minLength(10)]],
      assessorId: [defaultAssessorId, [Validators.required]]
    });

    this.loadClaimContext();
  }

  loadClaimContext(): void {
    this.isLoading = true;

    if (this.claimType === 'equipment') {
      this.claimService.getEquipmentClaimById(this.claimId).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success && res.data) {
            this.equipmentClaim = res.data;
            this.reviewForm.patchValue({
              approvedAmount: res.data.approvedAmount || res.data.claimedAmount,
              status: res.data.status || ClaimStatus.APPROVED
            });
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Error loading claim context.';
        }
      });
    } else {
      this.claimService.getIncomeClaimById(this.claimId).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success && res.data) {
            this.incomeClaim = res.data;
            const claimed =
              res.data.totalBenefitClaimed ||
              res.data.monthlyBenefitClaimed * res.data.benefitMonthsClaimed;
            this.reviewForm.patchValue({
              approvedAmount: res.data.approvedBenefitAmount || claimed,
              status: res.data.status || ClaimStatus.APPROVED
            });
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Error loading claim context.';
        }
      });
    }
  }

  onSubmit(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const payload: ReviewClaimRequest = {
      status: this.reviewForm.value.status,
      assessorNotes: this.reviewForm.value.assessorNotes,
      assessorId: this.reviewForm.value.assessorId,
      approvedAmount: this.reviewForm.value.approvedAmount
        ? Number(this.reviewForm.value.approvedAmount)
        : undefined
    };

    const review$: Observable<ApiResponse<EquipmentClaim | IncomeClaim>> =
      this.claimType === 'equipment'
        ? this.claimService.reviewEquipmentClaim(this.claimId, payload)
        : this.claimService.reviewIncomeClaim(this.claimId, payload);

    review$.subscribe({
      next: (response: ApiResponse<EquipmentClaim | IncomeClaim>) => {
        this.isSubmitting = false;
        if (response.success) {
          this.notificationService.showSuccess(
            `Claim assessment updated to ${payload.status}`
          );
          this.router.navigate(['/claims']);
        } else {
          this.errorMessage = response.message || 'Failed to review claim.';
        }
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Error updating claim review.';
        this.notificationService.showError(this.errorMessage!);
      }
    });
  }
}
