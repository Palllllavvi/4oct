// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/projects/projects.actions.ts
// ─────────────────────────────────────────────────────────────────────────────
import { createAction, props } from '@ngrx/store';
import { ProjectDetailsDTO } from '../models/project.model';

// ── Load Projects List ─────────────────────────────────────────────────────

export const loadProjects = createAction('[Projects] Load Projects');

export const loadProjectsSuccess = createAction(
  '[Projects] Load Projects Success',
  props<{ projects: ProjectDetailsDTO[] }>()
);

export const loadProjectsFailure = createAction(
  '[Projects] Load Projects Failure',
  props<{ error: string }>()
);

// ── Load Single Project ────────────────────────────────────────────────────

export const loadProject = createAction(
  '[Projects] Load Project',
  props<{ id: number | string }>()
);

export const loadProjectSuccess = createAction(
  '[Projects] Load Project Success',
  props<{ project: ProjectDetailsDTO }>()
);

export const loadProjectFailure = createAction(
  '[Projects] Load Project Failure',
  props<{ error: string }>()
);

// ── Create Project ─────────────────────────────────────────────────────────

export const createProject = createAction(
  '[Projects] Create Project',
  props<{ request: any }>()
);

export const createProjectSuccess = createAction(
  '[Projects] Create Project Success',
  props<{ project: ProjectDetailsDTO }>()
);

export const createProjectFailure = createAction(
  '[Projects] Create Project Failure',
  props<{ error: string }>()
);

// ── Clear Selected Project ─────────────────────────────────────────────────

export const clearSelectedProject = createAction('[Projects] Clear Selected');

export const clearProjectsError = createAction('[Projects] Clear Error');
