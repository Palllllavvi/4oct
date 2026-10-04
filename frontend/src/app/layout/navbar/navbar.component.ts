import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  readonly layoutService = inject(LayoutService);
  private readonly router = inject(Router);

  get user() {
    return this.authService.currentUser();
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  get userRole(): string {
    return this.authService.getUserRole() || 'GUEST';
  }

  get roleBadgeColor(): string {
    switch (this.userRole) {
      case 'ROLE_ADMIN':
        return 'badge-admin';
      case 'ROLE_UNDERWRITER':
        return 'badge-underwriter';
      case 'ROLE_ASSESSOR':
        return 'badge-assessor';
      default:
        return 'badge-freelancer';
    }
  }

  get roleLabel(): string {
    switch (this.userRole) {
      case 'ROLE_ADMIN':
        return 'Admin';
      case 'ROLE_UNDERWRITER':
        return 'Underwriter';
      case 'ROLE_ASSESSOR':
        return 'Assessor';
      case 'ROLE_FREELANCER':
        return 'Freelancer';
      default:
        return this.userRole;
    }
  }

  toggleSidebar(): void {
    this.layoutService.toggleSidebar();
  }

  logout(): void {
    this.authService.logout();
  }
}
