import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../../../../core/services/auth.service';
import { DashboardService, UnderwriterStats } from '../../../dashboard.service';
import { PolicyRequestService } from '../../../../policies/services/policy-request.service';

@Component({
  selector: 'app-underwriter-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatBadgeModule
  ],
  templateUrl: './underwriter-dashboard.component.html',
  styleUrls: ['./underwriter-dashboard.component.css']
})
export class UnderwriterDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);
  private readonly policyRequestService = inject(PolicyRequestService);

  user = this.authService.currentUser();
  loading = true;
  pendingApplications = 0;
  stats: UnderwriterStats = {
    policiesIssued: 0,
    equipmentPolicies: 0,
    incomePolicies: 0
  };

  ngOnInit(): void {
    // Count pending freelancer policy applications from localStorage
    this.pendingApplications = this.policyRequestService.getPending().length;

    this.dashboardService.getUnderwriterStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
