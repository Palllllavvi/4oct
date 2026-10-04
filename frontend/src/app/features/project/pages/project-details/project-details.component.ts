import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../../../core/services/auth.service';
import {
  EquipmentDTO,
  ProjectDetailsDTO,
  ProjectStatus
} from '../../models/project.model';
import { AgreementUploadComponent } from './agreement-upload/agreement-upload.component';
import { AddEquipmentComponent } from './add-equipment/add-equipment.component';
import { HandoverComponent } from './handover/handover.component';
import { ReturnEquipmentComponent } from './return-equipment/return-equipment.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  projectId!: number;
  project: ProjectDetailsDTO | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  readonly displayedEquipmentColumns: string[] = [
    'type',
    'details',
    'serialNumber',
    'declaredValue',
    'condition',
    'status'
  ];

  readonly ProjectStatus = ProjectStatus;

  get isFreelancer(): boolean {
    return this.authService.getUserRole() === 'ROLE_FREELANCER';
  }

  get canManage(): boolean {
    const role = this.authService.getUserRole();
    if (role === 'ROLE_ADMIN') return true;
    if (role === 'ROLE_FREELANCER') {
      const currentUserId = this.authService.getUserId();
      return !this.project || this.project.userId === currentUserId;
    }
    return false;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || isNaN(Number(idParam))) {
      this.errorMessage = 'Invalid Project Identifier';
      this.isLoading = false;
      return;
    }

    this.projectId = Number(idParam);
    this.loadProjectDetails();
  }

  loadProjectDetails(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.projectService.getProjectById(this.projectId).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.project = response.data;
        } else {
          this.errorMessage = response.message || 'Failed to load project details.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error loading project information.';
      }
    });
  }

  openAgreementDialog(): void {
    if (!this.project) return;

    const dialogRef = this.dialog.open(AgreementUploadComponent, {
      width: '650px',
      data: {
        projectId: this.project.id,
        currentAgreement: this.project.agreement
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Service agreement analyzed successfully!', 'Close', { duration: 3500 });
        this.loadProjectDetails();
      }
    });
  }

  openAddEquipmentDialog(): void {
    if (!this.project) return;

    const dialogRef = this.dialog.open(AddEquipmentComponent, {
      width: '620px',
      data: {
        projectId: this.project.id
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Equipment added to project inventory.', 'Close', { duration: 3500 });
        this.loadProjectDetails();
      }
    });
  }

  openHandoverDialog(): void {
    if (!this.project) return;

    const dialogRef = this.dialog.open(HandoverComponent, {
      width: '700px',
      data: {
        projectId: this.project.id,
        equipmentList: this.project.equipmentList || []
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Equipment custody handover registered.', 'Close', { duration: 3500 });
        this.loadProjectDetails();
      }
    });
  }

  openReturnEquipmentDialog(): void {
    if (!this.project) return;

    const dialogRef = this.dialog.open(ReturnEquipmentComponent, {
      width: '700px',
      data: {
        projectId: this.project.id,
        equipmentList: this.project.equipmentList || []
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Equipment return verified and recorded.', 'Close', { duration: 3500 });
        this.loadProjectDetails();
      }
    });
  }

  getStatusClass(status: ProjectStatus | undefined): string {
    switch (status) {
      case ProjectStatus.INSURED:
        return 'badge-insured';
      case ProjectStatus.QUOTE:
        return 'badge-quote';
      case ProjectStatus.COMPLETED:
        return 'badge-completed';
      case ProjectStatus.CLOSED:
        return 'badge-closed';
      case ProjectStatus.DRAFT:
      default:
        return 'badge-draft';
    }
  }

  calculateTotalEquipmentValue(): number {
    if (!this.project?.equipmentList) return 0;
    return this.project.equipmentList.reduce((acc, eq) => acc + (eq.declaredValue || 0), 0);
  }
}
