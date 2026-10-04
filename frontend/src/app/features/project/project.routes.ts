import { Routes } from '@angular/router';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { Role } from '../../core/models/user.model';

export const PROJECT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: ProjectListComponent,
        title: 'Projects | FreelanceShield'
      },
      {
        path: 'create',
        component: CreateProjectComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.ROLE_FREELANCER, Role.FREELANCER] },
        title: 'Create Project | FreelanceShield'
      },
      {
        path: 'new',
        redirectTo: 'create',
        pathMatch: 'full'
      },
      {
        path: ':id',
        component: ProjectDetailsComponent,
        title: 'Project Details | FreelanceShield'
      }
    ]
  }
];
