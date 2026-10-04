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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-agreement-upload',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './agreement-upload.component.html',
  styleUrls: ['./agreement-upload.component.css']
})
export class AgreementUploadComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);
  readonly dialogRef = inject(MatDialogRef<AgreementUploadComponent>);

  agreementForm!: FormGroup;
  isProcessing = false;
  errorMessage: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { projectId: number }
  ) {}

  ngOnInit(): void {
    this.agreementForm = this.fb.group({
      documentName: ['', [Validators.required]],
      documentText: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  get f() {
    return this.agreementForm.controls;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.agreementForm.patchValue({ documentName: file.name });

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        this.agreementForm.patchValue({ documentText: text });
      };
      reader.readAsText(file);
    }
  }

  onSubmit(): void {
    if (this.agreementForm.invalid) {
      this.agreementForm.markAllAsTouched();
      return;
    }

    this.isProcessing = true;
    this.errorMessage = null;

    const { documentName, documentText } = this.agreementForm.value;

    this.projectService.uploadAgreement(this.data.projectId, { documentName, documentText }).subscribe({
      next: (response) => {
        this.isProcessing = false;
        if (response.success) {
          this.dialogRef.close(response.data);
        } else {
          this.errorMessage = response.message || 'Agreement processing failed.';
        }
      },
      error: (err) => {
        this.isProcessing = false;
        this.errorMessage = err.error?.message || 'Failed to analyze agreement clauses.';
      }
    });
  }
}
