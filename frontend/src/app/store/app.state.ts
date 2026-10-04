// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/app.state.ts
// ─────────────────────────────────────────────────────────────────────────────
import { ActionReducerMap } from '@ngrx/store';

// Auth
import { AuthState } from '../features/auth/store/auth.state';
import { authReducer } from '../features/auth/store/auth.reducer';
import { AuthEffects } from '../features/auth/store/auth.effects';

// Projects
import { ProjectsState } from '../features/project/store/project.state';
import { projectsReducer } from '../features/project/store/project.reducer';
import { ProjectsEffects } from '../features/project/store/project.effects';

// Policies
import { PoliciesState } from '../features/policies/store/policy.state';
import { policiesReducer } from '../features/policies/store/policy.reducer';
import { PoliciesEffects } from '../features/policies/store/policy.effects';

// Claims
import { ClaimsState } from '../features/claim/store/claim.state';
import { claimsReducer } from '../features/claim/store/claim.reducer';
import { ClaimsEffects } from '../features/claim/store/claim.effects';

export interface AppState {
  auth: AuthState;
  projects: ProjectsState;
  policies: PoliciesState;
  claims: ClaimsState;
}

export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  projects: projectsReducer,
  policies: policiesReducer,
  claims: claimsReducer
};

export const appEffects = [
  AuthEffects,
  ProjectsEffects,
  PoliciesEffects,
  ClaimsEffects
];
