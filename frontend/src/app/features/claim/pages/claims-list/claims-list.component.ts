import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ClaimService } from '../../services/claim.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ClaimStatus, EquipmentClaim, IncomeClaim } from '../../models/claim.model';
import { DataTableWrapperComponent } from '../../../../shared/components/data-table-wrapper/data-table-wrapper.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-claims-list',
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
    MatTabsModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    DataTableWrapperComponent,
    EmptyStateComponent
  ],
  templateUrl: './claims-list.component.html',
  styleUrls: ['./claims-list.component.css']
})
export class ClaimsListComponent implements OnInit {
  private readonly claimService = inject(ClaimService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  equipmentColumns: string[] = [
    'claimNumber',
    'policyNumber',
    'equipment',
    'incident',
    'claimedAmount',
    'approvedAmount',
    'status',
    'actions'
  ];

  incomeColumns: string[] = [
    'claimNumber',
    'policyNumber',
    'freelancer',
    'termination',
    'claimedAmount',
    'approvedAmount',
    'status',
    'actions'
  ];

  equipmentDataSource = new MatTableDataSource<EquipmentClaim>([]);
  incomeDataSource = new MatTableDataSource<IncomeClaim>([]);

  isLoading = true;
  errorMessage: string | null = null;

  totalClaimsCount = 0;
  underReviewCount = 0;
  approvedCount = 0;
  settledAmountTotal = 0;

  @ViewChild('eqPaginator') eqPaginator!: MatPaginator;
  @ViewChild('incPaginator') incPaginator!: MatPaginator;
  @ViewChild('eqSort') eqSort!: MatSort;
  @ViewChild('incSort') incSort!: MatSort;

  get isFreelancer(): boolean {
    const role = this.authService.getUserRole();
    return role === 'ROLE_FREELANCER' || role === 'FREELANCER';
  }

  get canReview(): boolean {
    const role = this.authService.getUserRole();
    return role === 'ROLE_ASSESSOR' || role === 'ASSESSOR' || role === 'ROLE_ADMIN' || role === 'ADMIN';
  }

  ngOnInit(): void {
    this.loadAllClaims();
  }

  loadAllClaims(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const role = this.authService.getUserRole();
    const userId = this.authService.getUserId();

    const isGlobal = role === 'ROLE_ASSESSOR' || role === 'ASSESSOR' || role === 'ROLE_ADMIN' || role === 'ADMIN' || !userId;

    const eq$ = isGlobal
      ? this.claimService.getAllEquipmentClaims()
      : this.claimService.getEquipmentClaimsForUser(userId);

    const inc$ = isGlobal
      ? this.claimService.getAllIncomeClaims()
      : this.claimService.getIncomeClaimsForUser(userId);

    eq$.subscribe({
      next: (eqRes) => {
        if (eqRes.success && eqRes.data) {
          this.equipmentDataSource.data = eqRes.data;
          setTimeout(() => {
            this.equipmentDataSource.paginator = this.eqPaginator;
            this.equipmentDataSource.sort = this.eqSort;
          });
        }
        // Load income claims
        inc$.subscribe({
          next: (incRes) => {
            this.isLoading = false;
            if (incRes.success && incRes.data) {
              this.incomeDataSource.data = incRes.data;
              setTimeout(() => {
                this.incomeDataSource.paginator = this.incPaginator;
                this.incomeDataSource.sort = this.incSort;
              });
            }
            this.calculateMetrics();
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Error loading income claims.';
            this.calculateMetrics();
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error loading equipment claims.';
      }
    });
  }

  applyEquipmentFilter(query: string): void {
    this.equipmentDataSource.filter = query;
    if (this.equipmentDataSource.paginator) {
      this.equipmentDataSource.paginator.firstPage();
    }
  }

  applyIncomeFilter(query: string): void {
    this.incomeDataSource.filter = query;
    if (this.incomeDataSource.paginator) {
      this.incomeDataSource.paginator.firstPage();
    }
  }

  getStatusClass(status: ClaimStatus): string {
    switch (status) {
      case ClaimStatus.SUBMITTED:
        return 'badge-submitted';
      case ClaimStatus.UNDER_REVIEW:
        return 'badge-review';
      case ClaimStatus.APPROVED:
        return 'badge-approved';
      case ClaimStatus.SETTLED:
        return 'badge-settled';
      case ClaimStatus.REJECTED:
        return 'badge-rejected';
      default:
        return 'badge-muted';
    }
  }

  private calculateMetrics(): void {
    const eq = this.equipmentDataSource.data;
    const inc = this.incomeDataSource.data;

    this.totalClaimsCount = eq.length + inc.length;
    this.underReviewCount =
      eq.filter((c) => c.status === ClaimStatus.UNDER_REVIEW || c.status === ClaimStatus.SUBMITTED).length +
      inc.filter((c) => c.status === ClaimStatus.UNDER_REVIEW || c.status === ClaimStatus.SUBMITTED).length;

    this.approvedCount =
      eq.filter((c) => c.status === ClaimStatus.APPROVED || c.status === ClaimStatus.SETTLED).length +
      inc.filter((c) => c.status === ClaimStatus.APPROVED || c.status === ClaimStatus.SETTLED).length;

    const eqSettled = eq.reduce((sum, c) => sum + (c.approvedAmount || 0), 0);
    const incSettled = inc.reduce((sum, c) => sum + (c.approvedBenefitAmount || 0), 0);
    this.settledAmountTotal = eqSettled + incSettled;
  }
}
