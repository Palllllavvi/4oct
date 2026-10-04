import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../../core/services/auth.service';
import { LayoutService } from '../../core/services/layout.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
  badge?: string;
}

interface NavGroup {
  label: string;
  icon: string;
  roles?: string[];
  children: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatRippleModule,
    MatExpansionModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  readonly authService = inject(AuthService);
  readonly layoutService = inject(LayoutService);
  private readonly router = inject(Router);

  get userRole(): string {
    return this.authService.getUserRole() || '';
  }

  get user() {
    return this.authService.currentUser();
  }

  mainNavItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'My Projects',
      icon: 'work',
      route: '/projects',
      roles: ['ROLE_FREELANCER', 'ROLE_ADMIN']
    }
  ];

  navGroups: NavGroup[] = [
    {
      label: 'Policies',
      icon: 'verified_user',
      roles: ['ROLE_FREELANCER', 'ROLE_UNDERWRITER', 'ROLE_ADMIN'],
      children: [
        // ── Freelancer: apply for policies ──
        {
          label: 'Apply: Equipment Policy',
          icon: 'devices',
          route: '/risk/equipment-quote',
          roles: ['ROLE_FREELANCER']
        },
        {
          label: 'Apply: Income Assurance',
          icon: 'trending_up',
          route: '/risk/income-quote',
          roles: ['ROLE_FREELANCER']
        },
        // ── Shared policy lists ──
        {
          label: 'My Policy Applications',
          icon: 'assignment',
          route: '/policies/my-requests',
          roles: ['ROLE_FREELANCER']
        },
        {
          label: 'Equipment Policies',
          icon: 'computer',
          route: '/policies/equipment',
          roles: ['ROLE_FREELANCER', 'ROLE_UNDERWRITER', 'ROLE_ADMIN']
        },
        {
          label: 'Income Policies',
          icon: 'payments',
          route: '/policies/income',
          roles: ['ROLE_FREELANCER', 'ROLE_UNDERWRITER', 'ROLE_ADMIN']
        },
        // ── Underwriter only ──
        {
          label: 'Issue Equipment Policy',
          icon: 'add_circle',
          route: '/policies/equipment/issue',
          roles: ['ROLE_UNDERWRITER', 'ROLE_ADMIN']
        },
        {
          label: 'Issue Income Policy',
          icon: 'add_circle_outline',
          route: '/policies/income/issue',
          roles: ['ROLE_UNDERWRITER', 'ROLE_ADMIN']
        },
        {
          label: 'Application Queue',
          icon: 'pending_actions',
          route: '/policies/underwriter-requests',
          roles: ['ROLE_UNDERWRITER', 'ROLE_ADMIN']
        }
      ]
    },
    {
      label: 'Claims',
      icon: 'assignment_turned_in',
      roles: ['ROLE_FREELANCER', 'ROLE_ASSESSOR', 'ROLE_ADMIN'],
      children: [
        {
          label: 'All Claims',
          icon: 'list_alt',
          route: '/claims',
          roles: ['ROLE_FREELANCER', 'ROLE_ASSESSOR', 'ROLE_ADMIN']
        },
        {
          label: 'Submit Equipment Claim',
          icon: 'report',
          route: '/claims/equipment/submit',
          roles: ['ROLE_FREELANCER']
        },
        {
          label: 'Submit Income Claim',
          icon: 'money_off',
          route: '/claims/income/submit',
          roles: ['ROLE_FREELANCER']
        }
      ]
    }
  ];

  bottomNavItems: NavItem[] = [];

  accountNavItems: NavItem[] = [
    {
      label: 'My Profile',
      icon: 'person',
      route: '/profile'
    }
  ];

  isItemVisible(item: NavItem | NavGroup): boolean {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    return item.roles.includes(this.userRole);
  }

  isGroupActive(group: NavGroup): boolean {
    return group.children.some(child =>
      this.router.isActive(child.route, { paths: 'subset', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' })
    );
  }

  onNavigate(): void {
    if (this.layoutService.isMobile()) {
      this.layoutService.setSidebarOpen(false);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
