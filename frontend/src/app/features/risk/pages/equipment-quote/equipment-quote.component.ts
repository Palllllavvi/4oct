import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { EquipmentQuoteRequest, EquipmentQuoteResponse } from '../../models/risk.model';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { AuthService } from '../../../../core/services/auth.service';
import { PolicyRequestService } from '../../../policies/services/policy-request.service';
import { EquipmentPolicyRequest } from '../../../policies/models/policy-request.model';

@Component({
  selector: 'app-equipment-quote',
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
  templateUrl: './equipment-quote.component.html',
  styleUrls: ['./equipment-quote.component.css']
})
export class EquipmentQuoteComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly riskService = inject(RiskService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly policyRequestService = inject(PolicyRequestService);
  private readonly snackBar = inject(MatSnackBar);

  quoteForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  quoteResult: EquipmentQuoteResponse | null = null;
  errorMessage: string | null = null;
  requestSubmitted = false;

  // Is the current user a freelancer?
  get isFreelancer(): boolean {
    const role = this.authService.getUserRole();
    return role === 'ROLE_FREELANCER' || role === 'FREELANCER';
  }

  // Is the current user an underwriter or admin?
  get isUnderwriter(): boolean {
    const role = this.authService.getUserRole();
    return role === 'ROLE_UNDERWRITER' || role === 'ROLE_ADMIN';
  }

  availableCoverages = ['THEFT', 'ACCIDENTAL_DAMAGE', 'WATER_DAMAGE', 'FIRE', 'TRANSIT_LOSS'];

  ngOnInit(): void {
    this.quoteForm = this.fb.group({
      projectName: ['', Validators.required],
      clientName: ['', Validators.required],
      clientCompanyName: [''],
      location: ['On-site / Studio', Validators.required],
      startDate: [new Date().toISOString().substring(0, 10), Validators.required],
      endDate: [
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
        Validators.required
      ],
      deductibleAmount: [100, [Validators.required, Validators.min(0)]],
      coverages: [['THEFT', 'ACCIDENTAL_DAMAGE'], Validators.required],
      equipmentList: this.fb.array([this.createEquipmentItem()])
    });
  }

  get equipmentItems(): FormArray {
    return this.quoteForm.get('equipmentList') as FormArray;
  }

  createEquipmentItem(): FormGroup {
    return this.fb.group({
      equipmentType: ['LAPTOP', Validators.required],
      brand: ['Apple', Validators.required],
      model: ['MacBook Pro 16', Validators.required],
      serialNumber: ['SN-' + Math.floor(Math.random() * 90000 + 10000), Validators.required],
      declaredValue: [2500, [Validators.required, Validators.min(100)]],
      condition: ['EXCELLENT', Validators.required]
    });
  }

  addEquipment(): void {
    this.equipmentItems.push(this.createEquipmentItem());
  }

  removeEquipment(index: number): void {
    if (this.equipmentItems.length > 1) {
      this.equipmentItems.removeAt(index);
    }
  }

  calculateQuote(): void {
    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formVal = this.quoteForm.value;
    const request: EquipmentQuoteRequest = {
      projectId: undefined,
      equipmentList: formVal.equipmentList,
      startDate: formVal.startDate,
      endDate: formVal.endDate,
      location: formVal.location,
      coverages: formVal.coverages,
      deductibleAmount: formVal.deductibleAmount
    };

    this.riskService.getEquipmentQuote(request).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.data) {
          this.quoteResult = res.data;
        } else {
          this.errorMessage = res?.message || 'Failed to generate quote';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Error generating quote. Ensure Gateway is reachable at http://localhost:9090';
      }
    });
  }

  /**
   * Freelancer submits a policy application request.
   * The request is stored and will appear in the underwriter's queue.
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

    // If we don't have a quote yet, calculate one first, then submit
    if (!this.quoteResult) {
      const request: EquipmentQuoteRequest = {
        projectId: undefined,
        equipmentList: formVal.equipmentList,
        startDate: formVal.startDate,
        endDate: formVal.endDate,
        location: formVal.location,
        coverages: formVal.coverages,
        deductibleAmount: formVal.deductibleAmount
      };

      this.riskService.getEquipmentQuote(request).subscribe({
        next: (res) => {
          if (res && res.data) {
            this.quoteResult = res.data;
          }
          this.doSubmitRequest(userId, user?.name || 'Freelancer', user?.email || '', formVal);
        },
        error: () => {
          // Submit even without a quote
          this.doSubmitRequest(userId, user?.name || 'Freelancer', user?.email || '', formVal);
        }
      });
    } else {
      this.doSubmitRequest(userId, user?.name || 'Freelancer', user?.email || '', formVal);
    }
  }

  private doSubmitRequest(userId: number, name: string, email: string, formVal: any): void {
    const policyRequest: EquipmentPolicyRequest = {
      id: this.policyRequestService.generateId(),
      type: 'EQUIPMENT',
      status: 'PENDING',
      freelancerId: userId,
      freelancerName: name,
      freelancerEmail: email,
      submittedAt: new Date().toISOString(),
      projectName: formVal.projectName,
      clientName: formVal.clientName,
      clientCompanyName: formVal.clientCompanyName,
      location: formVal.location,
      startDate: formVal.startDate,
      endDate: formVal.endDate,
      deductibleAmount: formVal.deductibleAmount,
      coverages: formVal.coverages,
      equipmentList: formVal.equipmentList,
      quoteData: this.quoteResult
    };

    this.policyRequestService.submitRequest(policyRequest);
    this.isSubmitting = false;
    this.requestSubmitted = true;

    this.snackBar.open(
      '✅ Equipment policy application submitted! The underwriter will review it shortly.',
      'View My Requests',
      { duration: 5000, panelClass: ['success-snackbar'] }
    ).onAction().subscribe(() => {
      this.router.navigate(['/policies/my-requests']);
    });
  }

  proceedToIssue(): void {
    this.router.navigate(['/policies/equipment/issue']);
  }
}
