import { Routes } from '@angular/router';
import { EquipmentPolicyListComponent } from './pages/equipment-policies/equipment-policy-list.component';
import { IncomePolicyListComponent } from './pages/income-policies/income-policy-list.component';
import { IssueEquipmentPolicyComponent } from './pages/issue-equipment-policy/issue-equipment-policy.component';
import { IssueIncomePolicyComponent } from './pages/issue-income-policy/issue-income-policy.component';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { Role } from '../../core/models/user.model';

export const POLICY_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'equipment',
        pathMatch: 'full'
      },
      {
        path: 'equipment',
        component: EquipmentPolicyListComponent,
        title: 'Equipment Policies | FreelanceShield'
      },
      {
        path: 'income',
        component: IncomePolicyListComponent,
        title: 'Income Policies | FreelanceShield'
      },
      {
        path: 'equipment/issue',
        component: IssueEquipmentPolicyComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_UNDERWRITER, Role.UNDERWRITER, Role.ROLE_ADMIN, Role.ADMIN] },
        title: 'Issue Equipment Policy | FreelanceShield'
      },
      {
        path: 'income/issue',
        component: IssueIncomePolicyComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_UNDERWRITER, Role.UNDERWRITER, Role.ROLE_ADMIN, Role.ADMIN] },
        title: 'Issue Income Policy | FreelanceShield'
      }
    ]
  }
];
