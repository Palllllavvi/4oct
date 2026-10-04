import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './core/models/user.model';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.component').then(
        (m) => m.LandingComponent
      ),
    pathMatch: 'full',
    title: 'FreelanceShield | Autonomous Insurance for Creators'
  },

  // ── Auth (eager-loaded, public) ──────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
    title: 'Sign In | FreelanceShield'
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    title: 'Create Account | FreelanceShield'
  },

  // ── Dashboard (protected) ────────────────────────────────────────────────
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    title: 'Dashboard | FreelanceShield',
    children: [
      {
        path: 'freelancer',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/freelancer-dashboard/freelancer-dashboard.component').then(
            (m) => m.FreelancerDashboardComponent
          ),
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_FREELANCER, Role.ROLE_ADMIN] },
        title: 'Freelancer Dashboard | FreelanceShield'
      },
      {
        path: 'underwriter',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/underwriter-dashboard/underwriter-dashboard.component').then(
            (m) => m.UnderwriterDashboardComponent
          ),
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_UNDERWRITER, Role.ROLE_ADMIN] },
        title: 'Underwriter Dashboard | FreelanceShield'
      },
      {
        path: 'assessor',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/assessor-dashboard/assessor-dashboard.component').then(
            (m) => m.AssessorDashboardComponent
          ),
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_ASSESSOR, Role.ROLE_ADMIN] },
        title: 'Assessor Dashboard | FreelanceShield'
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_ADMIN] },
        title: 'Admin Dashboard | FreelanceShield'
      }
    ]
  },

  // ── Projects (protected) ─────────────────────────────────────────────────
  {
    path: 'projects',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/project/pages/project-list/project-list.component').then(
            (m) => m.ProjectListComponent
          ),
        title: 'Projects | FreelanceShield'
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./features/project/pages/create-project/create-project.component').then(
            (m) => m.CreateProjectComponent
          ),
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_FREELANCER] },
        title: 'Create Project | FreelanceShield'
      },
      {
        path: 'new',
        redirectTo: 'create',
        pathMatch: 'full'
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/project/pages/project-details/project-details.component').then(
            (m) => m.ProjectDetailsComponent
          ),
        title: 'Project Details | FreelanceShield'
      }
    ]
  },

  // ── Policies (protected) ─────────────────────────────────────────────────
  {
    path: 'policies',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'equipment',
        pathMatch: 'full'
      },
      {
        path: 'equipment',
        loadComponent: () =>
          import('./features/policies/pages/equipment-policies/equipment-policy-list.component').then(
            (m) => m.EquipmentPolicyListComponent
          ),
        title: 'Equipment Policies | FreelanceShield'
      },
      {
        path: 'income',
        loadComponent: () =>
          import('./features/policies/pages/income-policies/income-policy-list.component').then(
            (m) => m.IncomePolicyListComponent
          ),
        title: 'Income Policies | FreelanceShield'
      },
      {
        path: 'equipment/issue',
        loadComponent: () =>
          import('./features/policies/pages/issue-equipment-policy/issue-equipment-policy.component').then(
            (m) => m.IssueEquipmentPolicyComponent
          ),
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_UNDERWRITER, Role.ROLE_ADMIN] },
        title: 'Issue Equipment Policy | FreelanceShield'
      },
      {
        path: 'income/issue',
        loadComponent: () =>
          import('./features/policies/pages/issue-income-policy/issue-income-policy.component').then(
            (m) => m.IssueIncomePolicyComponent
          ),
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_UNDERWRITER, Role.ROLE_ADMIN] },
        title: 'Issue Income Policy | FreelanceShield'
      },
      {
        path: 'my-requests',
        loadComponent: () =>
          import('./features/policies/pages/my-policy-requests/my-policy-requests.component').then(
            (m) => m.MyPolicyRequestsComponent
          ),
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_FREELANCER, Role.ROLE_ADMIN] },
        title: 'My Policy Applications | FreelanceShield'
      },
      {
        path: 'underwriter-requests',
        loadComponent: () =>
          import('./features/policies/pages/underwriter-requests/underwriter-requests.component').then(
            (m) => m.UnderwriterRequestsComponent
          ),
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_UNDERWRITER, Role.ROLE_ADMIN] },
        title: 'Policy Application Queue | FreelanceShield'
      }
    ]
  },

  // ── Claims (protected) ───────────────────────────────────────────────────
  {
    path: 'claims',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/claim/pages/claims-list/claims-list.component').then(
            (m) => m.ClaimsListComponent
          ),
        title: 'Claims | FreelanceShield'
      },
      {
        path: 'equipment/submit',
        loadComponent: () =>
          import('./features/claim/pages/equipment-claim/equipment-claim-form.component').then(
            (m) => m.EquipmentClaimFormComponent
          ),
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_FREELANCER] },
        title: 'Submit Equipment Claim | FreelanceShield'
      },
      {
        path: 'income/submit',
        loadComponent: () =>
          import('./features/claim/pages/income-claim/income-claim-form.component').then(
            (m) => m.IncomeClaimFormComponent
          ),
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_FREELANCER] },
        title: 'Submit Income Claim | FreelanceShield'
      },
      {
        path: ':type/:id/review',
        loadComponent: () =>
          import('./features/claim/pages/review-claim/review-claim.component').then(
            (m) => m.ReviewClaimComponent
          ),
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_ASSESSOR, Role.ROLE_ADMIN] },
        title: 'Review Claim | FreelanceShield'
      }
    ]
  },

  // ── Risk / Underwriting ───────────────────────────────────────────────────
  {
    path: 'risk',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/risk/risk.routes').then((m) => m.RISK_ROUTES),
  },
  {
    path: 'profile',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];