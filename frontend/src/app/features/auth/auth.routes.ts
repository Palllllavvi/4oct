import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Sign In | FreelanceShield'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Create Account | FreelanceShield'
  }
];
