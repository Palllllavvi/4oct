import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import type { ApiResponse } from '../../../../../core/models/api-response.model';
import { ProjectService } from '../../../services/project.service';
import { EquipmentCondition, EquipmentDTO, HandoverRequest, ProjectDetailsDTO } from '../../../models/project.model';

@Component({
  selector: 'app-handover',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './handover.component.html',
  styleUrls: ['./handover.component.css']
})
export class HandoverComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);
  readonly dialogRef = inject(MatDialogRef<HandoverComponent>);

  handoverForm!: FormGroup;
  isSaving = false;
  errorMessage: string | null = null;

  readonly conditions = [
    { value: EquipmentCondition.EXCELLENT, label: 'Excellent' },
    { value: EquipmentCondition.GOOD, label: 'Good' },
    { value: EquipmentCondition.FAIR, label: 'Fair' },
    { value: EquipmentCondition.DAMAGED, label: 'Damaged' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { projectId: number; equipmentList: EquipmentDTO[] }
  ) {}

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];

    this.handoverForm = this.fb.group({
      handoverDate: [today, [Validators.required]],
      items: this.fb.array([])
    });

    this.initItemControls();
  }

  get itemsFormArray(): FormArray {
    return this.handoverForm.get('items') as FormArray;
  }

  private initItemControls(): void {
    const list = this.data.equipmentList || [];
    for (const eq of list) {
      this.itemsFormArray.push(
        this.fb.group({
          equipmentId: [eq.id],
          equipmentName: [`${eq.brand} ${eq.model} (${eq.serialNumber})`],
          condition: [eq.condition || EquipmentCondition.GOOD, [Validators.required]],
          clientConfirmation: [true],
          freelancerConfirmation: [true],
          notes: ['']
        })
      );
    }
  }

  onSubmit(): void {
    if (this.handoverForm.invalid) {
      this.handoverForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    const payload: HandoverRequest = {
      projectId: this.data.projectId,
      handoverDate: this.handoverForm.value.handoverDate,
      items: this.itemsFormArray.value.map((item: any) => ({
        equipmentId: item.equipmentId,
        condition: item.condition,
        clientConfirmation: item.clientConfirmation,
        freelancerConfirmation: item.freelancerConfirmation,
        notes: item.notes
      }))
    };

    this.projectService.recordHandover(this.data.projectId, payload).subscribe({
      next: (response: ApiResponse<ProjectDetailsDTO>) => {
        this.isSaving = false;
        if (response.success) {
          this.dialogRef.close(response.data);
        } else {
          this.errorMessage = response.message || 'Failed to record handover.';
        }
      },
      error: (err: any) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Error recording custody handover.';
      }
    });
  }
}
