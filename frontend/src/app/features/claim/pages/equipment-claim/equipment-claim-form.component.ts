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
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ClaimService } from '../../services/claim.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { IncidentType, SubmitEquipmentClaimRequest } from '../../models/claim.model';

@Component({
  selector: 'app-equipment-claim-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './equipment-claim-form.component.html',
  styleUrls: ['./equipment-claim-form.component.css']
})
export class EquipmentClaimFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly claimService = inject(ClaimService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  claimForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  readonly incidentTypes = [
    { value: IncidentType.THEFT, label: 'Theft / Stolen Property' },
    { value: IncidentType.DAMAGE, label: 'Accidental Physical Damage' },
    { value: IncidentType.LOSS, label: 'Total Loss in Transit / On Set' },
    { value: IncidentType.WATER_DAMAGE, label: 'Water / Liquid Damage' },
    { value: IncidentType.FIRE, label: 'Fire / Heat Damage' },
    { value: IncidentType.TRANSIT_ACCIDENT, label: 'Vehicle or Shipping Collision' },
    { value: IncidentType.OTHER, label: 'Other Peril' }
  ];

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    if (role !== 'ROLE_FREELANCER' && role !== 'ROLE_ADMIN') {
      this.router.navigate(['/claims']);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const initialPolicyNumber = this.route.snapshot.queryParamMap.get('policyNumber') || '';
    const initialEquipmentName = this.route.snapshot.queryParamMap.get('equipmentName') || '';

    this.claimForm = this.fb.group({
      policyNumber: [initialPolicyNumber, [Validators.required]],
      equipmentName: [initialEquipmentName, [Validators.required]],
      incidentType: [IncidentType.DAMAGE, [Validators.required]],
      incidentDate: [today, [Validators.required]],
      incidentLocation: ['', [Validators.required]],
      incidentDescription: ['', [Validators.required, Validators.minLength(20)]],
      claimedAmount: [null, [Validators.required, Validators.min(1)]],
      reportingPolice: ['NO', [Validators.required]],
      policeReportNumber: [''],
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

    const payload: SubmitEquipmentClaimRequest = {
      policyNumber: this.claimForm.value.policyNumber,
      userId,
      equipmentName: this.claimForm.value.equipmentName,
      incidentType: this.claimForm.value.incidentType,
      incidentDate: this.claimForm.value.incidentDate,
      incidentLocation: this.claimForm.value.incidentLocation,
      incidentDescription: this.claimForm.value.incidentDescription,
      claimedAmount: Number(this.claimForm.value.claimedAmount),
      reportingPolice: this.claimForm.value.reportingPolice,
      policeReportNumber: this.claimForm.value.policeReportNumber || undefined,
      documentRefs: this.claimForm.value.documentRefs || undefined
    };

    this.claimService.submitEquipmentClaim(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success && response.data) {
          this.notificationService.showSuccess(
            `Claim submitted successfully: ${response.data.claimNumber}`
          );
          this.router.navigate(['/claims']);
        } else {
          this.errorMessage = response.message || 'Failed to submit claim.';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Error submitting equipment claim.';
        this.notificationService.showError(this.errorMessage!);
      }
    });
  }
}
