import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProjectService } from '../../services/project.service';
import { ProjectDetailsDTO, ProjectStatus } from '../../models/project.model';
import { AuthService } from '../../../../core/services/auth.service';
import { Role } from '../../../../core/models/user.model';
import { PolicyRequestService } from '../../../policies/services/policy-request.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EquipmentPolicyRequest } from '../../../policies/models/policy-request.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly policyRequestService = inject(PolicyRequestService);
  private readonly snackBar = inject(MatSnackBar);

  displayedColumns: string[] = [
    'projectName',
    'client',
    'location',
    'duration',
    'status',
    'equipmentCount',
    'actions'
  ];

  dataSource = new MatTableDataSource<ProjectDetailsDTO>([]);
  isLoading = true;
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  get isFreelancer(): boolean {
    return this.authService.getUserRole() === Role.ROLE_FREELANCER;
  }

  get userRole(): string {
    return this.authService.getUserRole() || '';
  }

  // Summary counts
  totalCount = 0;
  insuredCount = 0;
  draftCount = 0;
  completedCount = 0;

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Admin/Underwriter/Assessor can see all projects; Freelancers see their own
    const fetch$ = (this.userRole === Role.ROLE_ADMIN || this.userRole === Role.ROLE_UNDERWRITER || this.userRole === Role.ROLE_ASSESSOR)
      ? this.projectService.getAllProjects()
      : this.projectService.getMyProjects();

    fetch$.subscribe({
      next: (response) => {
        this.isLoading = false;
        const data = response.data || [];
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.updateStats(data);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Unable to load projects. Please try again.';
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getStatusClass(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.INSURED:
        return 'status-insured';
      case ProjectStatus.QUOTE:
        return 'status-quote';
      case ProjectStatus.COMPLETED:
        return 'status-completed';
      case ProjectStatus.CLOSED:
        return 'status-closed';
      default:
        return 'status-draft';
    }
  }

  viewProject(id: number): void {
    this.router.navigate(['/projects', id]);
  }

  applyForPolicy(project: ProjectDetailsDTO): void {
    if (!project.equipmentList || project.equipmentList.length === 0) {
      this.snackBar.open('Cannot apply for policy: Project has no equipment.', 'OK', { duration: 3000 });
      return;
    }

    const user = this.authService.currentUser();
    const userId = this.authService.getUserId() || user?.id || user?.userId || 1;
    const req: EquipmentPolicyRequest = {
      id: crypto.randomUUID(),
      type: 'EQUIPMENT',
      status: 'PENDING',
      freelancerId: userId,
      freelancerName: user?.name || 'Rahul Kumar',
      freelancerEmail: user?.email || 'rahul@freelance.in',
      submittedAt: new Date().toISOString(),
      projectId: project.id,
      projectName: project.projectName,
      clientName: project.client?.name || 'Unknown',
      clientCompanyName: project.client?.companyName || 'Unknown',
      location: project.location || 'Remote',
      startDate: project.startDate,
      endDate: project.expectedEndDate,
      deductibleAmount: 1000,
      coverages: ['Theft', 'Accidental Damage', 'Fire'],
      equipmentList: project.equipmentList.map(eq => ({
        equipmentType: eq.equipmentType || 'Other',
        brand: eq.brand || 'Unknown',
        model: eq.model || 'Unknown',
        serialNumber: eq.serialNumber || 'N/A',
        declaredValue: eq.declaredValue || 0,
        condition: eq.condition || 'Used'
      }))
    };

    this.policyRequestService.submitRequest(req);
    this.snackBar.open('Application submitted! Pending underwriter review.', 'View My Applications', { duration: 5000 })
      .onAction().subscribe(() => {
        this.router.navigate(['/policies/my-requests']);
      });
  }

  private updateStats(projects: ProjectDetailsDTO[]): void {
    this.totalCount = projects.length;
    this.insuredCount = projects.filter((p) => p.status === ProjectStatus.INSURED).length;
    this.draftCount = projects.filter((p) => p.status === ProjectStatus.DRAFT).length;
    this.completedCount = projects.filter((p) => p.status === ProjectStatus.COMPLETED).length;
  }
}
