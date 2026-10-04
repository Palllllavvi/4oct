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
import { EquipmentCondition, EquipmentDTO, ProjectDetailsDTO, ReturnEquipmentRequest } from '../../../models/project.model';

@Component({
  selector: 'app-return-equipment',
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
  templateUrl: './return-equipment.component.html',
  styleUrls: ['./return-equipment.component.css']
})
export class ReturnEquipmentComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);
  readonly dialogRef = inject(MatDialogRef<ReturnEquipmentComponent>);

  returnForm!: FormGroup;
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

    this.returnForm = this.fb.group({
      returnDate: [today, [Validators.required]],
      items: this.fb.array([])
    });

    this.initItemControls();
  }

  get itemsFormArray(): FormArray {
    return this.returnForm.get('items') as FormArray;
  }

  private initItemControls(): void {
    const list = this.data.equipmentList || [];
    for (const eq of list) {
      this.itemsFormArray.push(
        this.fb.group({
          equipmentId: [eq.id],
          equipmentName: [`${eq.brand} ${eq.model} (${eq.serialNumber})`],
          returnCondition: [eq.condition || EquipmentCondition.GOOD, [Validators.required]],
          clientConfirmedReturn: [true],
          returnNotes: ['']
        })
      );
    }
  }

  onSubmit(): void {
    if (this.returnForm.invalid) {
      this.returnForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    const payload: ReturnEquipmentRequest = {
      projectId: this.data.projectId,
      returnDate: this.returnForm.value.returnDate,
      items: this.itemsFormArray.value.map((item: any) => ({
        equipmentId: item.equipmentId,
        returnCondition: item.returnCondition,
        clientConfirmedReturn: item.clientConfirmedReturn,
        returnNotes: item.returnNotes
      }))
    };

    this.projectService.returnEquipment(this.data.projectId, payload).subscribe({
      next: (response: ApiResponse<ProjectDetailsDTO>) => {
        this.isSaving = false;
        if (response.success) {
          this.dialogRef.close(response.data);
        } else {
          this.errorMessage = response.message || 'Failed to record equipment return.';
        }
      },
      error: (err: any) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Error processing equipment return inspection.';
      }
    });
  }
}
