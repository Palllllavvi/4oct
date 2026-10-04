// ─────────────────────────────────────────────────────────────────────────────
// src/app/store/projects/projects.effects.ts
// ─────────────────────────────────────────────────────────────────────────────
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProjectService } from '../services/project.service';
import { selectUserRole } from '../../auth/store/auth.selectors';
import {
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

@Injectable()
export class ProjectsEffects {
  private readonly actions$ = inject(Actions);
  private readonly projectService = inject(ProjectService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  // ── Load list ─────────────────────────────────────────────────────────────
  loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProjects),
      withLatestFrom(this.store.select(selectUserRole)),
      switchMap(([, role]) => {
        const req$ = (role === 'ROLE_ADMIN' || role === 'ROLE_UNDERWRITER' || role === 'ROLE_ASSESSOR')
          ? this.projectService.getAllProjects()
          : this.projectService.getMyProjects();

        return req$.pipe(
          map(res => {
            if (res.success && res.data) {
              return loadProjectsSuccess({ projects: res.data });
            }
            return loadProjectsFailure({ error: res.message || 'Failed to load projects.' });
          }),
          catchError(err => of(loadProjectsFailure({ error: err.error?.message || 'Failed to load projects.' })))
        );
      })
    )
  );

  // ── Load single ───────────────────────────────────────────────────────────
  loadProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProject),
      switchMap(({ id }) =>
        this.projectService.getProjectById(id).pipe(
          map(res => {
            if (res.success && res.data) {
              return loadProjectSuccess({ project: res.data });
            }
            return loadProjectFailure({ error: res.message || 'Failed to load project.' });
          }),
          catchError(err => of(loadProjectFailure({ error: err.error?.message || 'Failed to load project.' })))
        )
      )
    )
  );

  // ── Create ────────────────────────────────────────────────────────────────
  createProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createProject),
      switchMap(({ request }) =>
        this.projectService.createProject(request).pipe(
          map(res => {
            if (res.success && res.data) {
              return createProjectSuccess({ project: res.data });
            }
            return createProjectFailure({ error: res.message || 'Failed to create project.' });
          }),
          catchError(err => of(createProjectFailure({ error: err.error?.message || 'Failed to create project.' })))
        )
      )
    )
  );

  createProjectSuccessNavigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createProjectSuccess),
        tap(({ project }) => this.router.navigate(['/projects', project.id]))
      ),
    { dispatch: false }
  );
}
