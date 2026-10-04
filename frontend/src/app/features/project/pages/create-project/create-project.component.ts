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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Role } from '../../../../core/models/user.model';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  projectForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    // Only ROLE_FREELANCER can create projects
    if (this.authService.getUserRole() !== Role.ROLE_FREELANCER) {
      this.router.navigate(['/projects']);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const defaultEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      location: [''],
      startDate: [today, [Validators.required]],
      expectedEndDate: [defaultEnd, [Validators.required]],
      clientName: ['', [Validators.required, Validators.minLength(2)]],
      clientCompanyName: [''],
      clientEmail: ['', [Validators.required, Validators.email]],
      clientPhone: ['']
    });
  }

  get f() {
    return this.projectForm.controls;
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.projectService.createProject(this.projectForm.value).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success && response.data?.id) {
          this.router.navigate(['/projects', response.data.id]);
        } else {
          this.router.navigate(['/projects']);
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage =
          err.error?.message ||
          'Failed to create project. Please verify inputs and ensure the backend is available.';
      }
    });
  }
}
