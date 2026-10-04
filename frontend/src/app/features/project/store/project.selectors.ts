// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/projects/projects.selectors.ts
// ─────────────────────────────────────────────────────────────────────────────
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectsState } from './project.state';

export const selectProjectsState = createFeatureSelector<ProjectsState>('projects');

export const selectAllProjects      = createSelector(selectProjectsState, s => s.projects);
export const selectSelectedProject  = createSelector(selectProjectsState, s => s.selectedProject);
export const selectProjectsLoading  = createSelector(selectProjectsState, s => s.isLoading);
export const selectProjectsCreating = createSelector(selectProjectsState, s => s.isCreating);
export const selectProjectsError    = createSelector(selectProjectsState, s => s.error);

export const selectProjectsCount = createSelector(
  selectAllProjects,
  projects => projects.length
);
