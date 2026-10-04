import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../../core/services/auth.service';
import { DashboardService, AssessorStats } from '../../../dashboard.service';

@Component({
  selector: 'app-assessor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './assessor-dashboard.component.html',
  styleUrls: ['./assessor-dashboard.component.css']
})
export class AssessorDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);

  user = this.authService.currentUser();
  loading = true;
  stats: AssessorStats = {
    pendingClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0
  };

  ngOnInit(): void {
    this.dashboardService.getAssessorStats().subscribe({
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
