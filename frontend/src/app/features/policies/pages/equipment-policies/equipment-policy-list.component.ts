import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PolicyService } from '../../services/policy.service';
import { AuthService } from '../../../../core/services/auth.service';
import { EquipmentPolicy, PolicyStatus } from '../../models/policy.model';
import { DataTableWrapperComponent } from '../../../../shared/components/data-table-wrapper/data-table-wrapper.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-equipment-policy-list',
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
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    DataTableWrapperComponent,
    EmptyStateComponent
  ],
  templateUrl: './equipment-policy-list.component.html',
  styleUrls: ['./equipment-policy-list.component.css']
})
export class EquipmentPolicyListComponent implements OnInit {
  private readonly policyService = inject(PolicyService);
  private readonly authService = inject(AuthService);

  displayedColumns: string[] = [
    'policyNumber',
    'project',
    'client',
    'insuredValue',
    'premium',
    'dates',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<EquipmentPolicy>([]);
  isLoading = true;
  errorMessage: string | null = null;

  totalPolicies = 0;
  totalInsuredValue = 0;
  totalPremium = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  get canIssuePolicy(): boolean {
    const role = this.authService.getUserRole();
    return role === 'ROLE_UNDERWRITER' || role === 'ROLE_ADMIN';
  }

  get canFileClaim(): boolean {
    const role = this.authService.getUserRole();
    return role === 'ROLE_FREELANCER' || role === 'FREELANCER' || role === 'ROLE_ADMIN' || role === 'ADMIN';
  }

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const role = this.authService.getUserRole();
    const userId = this.authService.getUserId();

    const fetch$ = (role === 'ROLE_UNDERWRITER' || role === 'ROLE_ADMIN' || !userId)
      ? this.policyService.getAllEquipmentPolicies()
      : this.policyService.getEquipmentPoliciesForUser(userId);

    fetch$.subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          const list = response.data;
          this.dataSource.data = list;
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
          this.calculateMetrics(list);
        } else {
          this.errorMessage = response.message || 'Failed to load policies.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error fetching equipment policies.';
      }
    });
  }

  applyFilter(query: string): void {
    this.dataSource.filter = query;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getStatusClass(status: PolicyStatus): string {
    switch (status) {
      case PolicyStatus.ACTIVE:
        return 'badge-active';
      case PolicyStatus.PENDING:
        return 'badge-pending';
      case PolicyStatus.EXPIRED:
        return 'badge-expired';
      case PolicyStatus.CANCELLED:
        return 'badge-cancelled';
      case PolicyStatus.CLAIMED:
        return 'badge-claimed';
      default:
        return 'badge-muted';
    }
  }

  private calculateMetrics(policies: EquipmentPolicy[]): void {
    this.totalPolicies = policies.length;
    this.totalInsuredValue = policies.reduce((sum, p) => sum + (p.insuredValue || 0), 0);
    this.totalPremium = policies.reduce((sum, p) => sum + (p.premium || 0), 0);
  }
}
