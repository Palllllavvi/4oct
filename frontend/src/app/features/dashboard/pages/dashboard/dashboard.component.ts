import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../../core/services/auth.service';
import { User, Role } from '../../../../core/models/user.model';
import { FreelancerDashboardComponent } from './freelancer-dashboard/freelancer-dashboard.component';
import { UnderwriterDashboardComponent } from './underwriter-dashboard/underwriter-dashboard.component';
import { AssessorDashboardComponent } from './assessor-dashboard/assessor-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    FreelancerDashboardComponent,
    UnderwriterDashboardComponent,
    AssessorDashboardComponent,
    AdminDashboardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  currentUser: User | null = null;
  activeRole = '';

  readonly roles = Role;

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    this.activeRole = this.authService.getUserRole() || Role.ROLE_FREELANCER;
  }

  isFreelancer(): boolean {
    return this.activeRole === Role.ROLE_FREELANCER;
  }

  isUnderwriter(): boolean {
    return this.activeRole === Role.ROLE_UNDERWRITER;
  }

  isAssessor(): boolean {
    return this.activeRole === Role.ROLE_ASSESSOR;
  }

  isAdmin(): boolean {
    return this.activeRole === Role.ROLE_ADMIN;
  }

  // Allow admin to preview other role perspectives
  switchRoleView(role: string): void {
    if (this.authService.getUserRole() === Role.ROLE_ADMIN) {
      this.activeRole = role;
    }
  }
}
