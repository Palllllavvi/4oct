import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PolicyService } from '../../services/policy.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { IssueEquipmentPolicyRequest } from '../../models/policy.model';

@Component({
  selector: 'app-issue-equipment-policy',
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
  templateUrl: './issue-equipment-policy.component.html',
  styleUrls: ['./issue-equipment-policy.component.css']
})
export class IssueEquipmentPolicyComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly policyService = inject(PolicyService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  policyForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  readonly conditions = ['EXCELLENT', 'GOOD', 'FAIR', 'DAMAGED'];

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    if (role !== 'ROLE_UNDERWRITER' && role !== 'ROLE_ADMIN') {
      this.router.navigate(['/policies/equipment']);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const defaultEnd = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    this.policyForm = this.fb.group({
      projectId: [null, [Validators.required, Validators.min(1)]],
      userId: [null, [Validators.required, Validators.min(1)]],
      projectName: ['', [Validators.required]],
      clientName: ['', [Validators.required]],
      clientCompanyName: [''],
      startDate: [today, [Validators.required]],
      endDate: [defaultEnd, [Validators.required]],
      insuredValue: [5000, [Validators.required, Validators.min(100)]],
      deductible: [250, [Validators.required, Validators.min(0)]],
      items: this.fb.array([])
    });

    // Add 1 default item
    this.addItem();
  }

  get items(): FormArray {
    return this.policyForm.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      equipmentName: ['', [Validators.required]],
      serialNumber: ['', [Validators.required]],
      insuredValue: [2500, [Validators.required, Validators.min(50)]],
      condition: ['EXCELLENT', [Validators.required]]
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.policyForm.invalid) {
      this.policyForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const request: IssueEquipmentPolicyRequest = {
      projectId: Number(this.policyForm.value.projectId),
      userId: Number(this.policyForm.value.userId),
      projectName: this.policyForm.value.projectName,
      clientName: this.policyForm.value.clientName,
      clientCompanyName: this.policyForm.value.clientCompanyName,
      startDate: this.policyForm.value.startDate,
      endDate: this.policyForm.value.endDate,
      insuredValue: Number(this.policyForm.value.insuredValue),
      deductible: Number(this.policyForm.value.deductible),
      items: this.items.value.map((item: any) => ({
        equipmentName: item.equipmentName,
        serialNumber: item.serialNumber,
        insuredValue: Number(item.insuredValue),
        condition: item.condition
      }))
    };

    this.policyService.issueEquipmentPolicy(request).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success && response.data) {
          this.notificationService.showSuccess(
            `Equipment policy issued: ${response.data.policyNumber}`
          );
          this.router.navigate(['/policies/equipment']);
        } else {
          this.errorMessage = response.message || 'Failed to issue policy.';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Error underwriting equipment policy.';
        this.notificationService.showError(this.errorMessage!);
      }
    });
  }
}
