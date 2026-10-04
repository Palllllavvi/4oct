// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/projects/projects.reducer.ts
// ─────────────────────────────────────────────────────────────────────────────
import { createReducer, on } from '@ngrx/store';
import { ProjectsState, initialProjectsState } from './project.state';
import {
  clearProjectsError,
  clearSelectedProject,
  createProject,
  createProjectFailure,
  createProjectSuccess,
  loadProject,
  loadProjectFailure,
  loadProjectSuccess,
  loadProjects,
  loadProjectsFailure,
  loadProjectsSuccess
} from './project.actions';

export const projectsReducer = createReducer(
  initialProjectsState,

  // ── Load List ────────────────────────────────────────────────────────────
  on(loadProjects, (state): ProjectsState => ({
    ...state, isLoading: true, error: null
  })),
  on(loadProjectsSuccess, (state, { projects }): ProjectsState => ({
    ...state, projects, isLoading: false
  })),
  on(loadProjectsFailure, (state, { error }): ProjectsState => ({
    ...state, isLoading: false, error
  })),

  // ── Load Single ──────────────────────────────────────────────────────────
  on(loadProject, (state): ProjectsState => ({
    ...state, isLoading: true, error: null, selectedProject: null
  })),
  on(loadProjectSuccess, (state, { project }): ProjectsState => ({
    ...state, selectedProject: project, isLoading: false
  })),
  on(loadProjectFailure, (state, { error }): ProjectsState => ({
    ...state, isLoading: false, error
  })),

  // ── Create ───────────────────────────────────────────────────────────────
  on(createProject, (state): ProjectsState => ({
    ...state, isCreating: true, error: null
  })),
  on(createProjectSuccess, (state, { project }): ProjectsState => ({
    ...state,
    projects: [...state.projects, project],
    selectedProject: project,
    isCreating: false
  })),
  on(createProjectFailure, (state, { error }): ProjectsState => ({
    ...state, isCreating: false, error
  })),

  // ── Clear ─────────────────────────────────────────────────────────────────
  on(clearSelectedProject, (state): ProjectsState => ({
    ...state, selectedProject: null
  })),
  on(clearProjectsError, (state): ProjectsState => ({
    ...state, error: null
  }))
);
