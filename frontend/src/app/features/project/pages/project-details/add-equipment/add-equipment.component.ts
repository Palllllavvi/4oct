import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectService } from '../../../services/project.service';
import { EquipmentCondition } from '../../../models/project.model';

@Component({
  selector: 'app-add-equipment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './add-equipment.component.html',
  styleUrls: ['./add-equipment.component.css']
})
export class AddEquipmentComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);
  readonly dialogRef = inject(MatDialogRef<AddEquipmentComponent>);

  equipmentForm!: FormGroup;
  isSaving = false;
  errorMessage: string | null = null;

  readonly conditions = [
    { value: EquipmentCondition.EXCELLENT, label: 'Excellent - Like New' },
    { value: EquipmentCondition.GOOD, label: 'Good - Minor Wear' },
    { value: EquipmentCondition.FAIR, label: 'Fair - Noticeable Wear' },
    { value: EquipmentCondition.DAMAGED, label: 'Damaged - Pre-existing Flaws' }
  ];

  readonly equipmentTypes = [
    'Laptop / Computer',
    'Camera Body',
    'Camera Lens',
    'Drone & Gimbal',
    'Lighting Kit',
    'Audio / Microphone Rig',
    'Monitors & Field Displays',
    'Storage & Server Hardware',
    'Other Equipment'
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { projectId: number }
  ) {}

  ngOnInit(): void {
    this.equipmentForm = this.fb.group({
      equipmentType: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      serialNumber: ['', [Validators.required]],
      declaredValue: [null, [Validators.required, Validators.min(1)]],
      condition: [EquipmentCondition.GOOD, [Validators.required]],
      ownershipEvidence: ['']
    });
  }

  get f() {
    return this.equipmentForm.controls;
  }

  onSubmit(): void {
    if (this.equipmentForm.invalid) {
      this.equipmentForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    this.projectService.addEquipment(this.data.projectId, this.equipmentForm.value).subscribe({
      next: (response) => {
        this.isSaving = false;
        if (response.success) {
          this.dialogRef.close(response.data);
        } else {
          this.errorMessage = response.message || 'Failed to register equipment.';
        }
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Error adding equipment to project.';
      }
    });
  }
}
