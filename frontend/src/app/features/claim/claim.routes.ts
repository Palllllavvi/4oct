import { Routes } from '@angular/router';
import { ClaimsListComponent } from './pages/claims-list/claims-list.component';
import { EquipmentClaimFormComponent } from './pages/equipment-claim/equipment-claim-form.component';
import { IncomeClaimFormComponent } from './pages/income-claim/income-claim-form.component';
import { ReviewClaimComponent } from './pages/review-claim/review-claim.component';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { Role } from '../../core/models/user.model';

export const CLAIM_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: ClaimsListComponent,
        title: 'Claims | FreelanceShield'
      },
      {
        path: 'equipment/submit',
        component: EquipmentClaimFormComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_FREELANCER, Role.FREELANCER, Role.ROLE_ADMIN, Role.ADMIN] },
        title: 'Submit Equipment Claim | FreelanceShield'
      },
      {
        path: 'equipment/new',
        component: EquipmentClaimFormComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_FREELANCER, Role.FREELANCER, Role.ROLE_ADMIN, Role.ADMIN] },
        title: 'Submit Equipment Claim | FreelanceShield'
      },
      {
        path: 'income/submit',
        component: IncomeClaimFormComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_FREELANCER, Role.FREELANCER, Role.ROLE_ADMIN, Role.ADMIN] },
        title: 'Submit Income Claim | FreelanceShield'
      },
      {
        path: 'income/new',
        component: IncomeClaimFormComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_FREELANCER, Role.FREELANCER, Role.ROLE_ADMIN, Role.ADMIN] },
        title: 'Submit Income Claim | FreelanceShield'
      },
      {
        path: ':type/:id',
        component: ReviewClaimComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_ASSESSOR, Role.ASSESSOR, Role.ROLE_ADMIN, Role.ADMIN] },
        title: 'Claim Details | FreelanceShield'
      },
      {
        path: ':type/:id/review',
        component: ReviewClaimComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_ASSESSOR, Role.ASSESSOR, Role.ROLE_ADMIN, Role.ADMIN] },
        title: 'Review Claim | FreelanceShield'
      }
    ]
  }
];
