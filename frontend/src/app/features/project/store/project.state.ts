// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/projects/projects.state.ts
// ─────────────────────────────────────────────────────────────────────────────
import { ProjectDetailsDTO } from '../models/project.model';

export interface ProjectsState {
  projects: ProjectDetailsDTO[];
  selectedProject: ProjectDetailsDTO | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
}

export const initialProjectsState: ProjectsState = {
  projects: [],
  selectedProject: null,
  isLoading: false,
  isCreating: false,
  error: null
};
