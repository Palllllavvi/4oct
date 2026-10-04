import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-data-table-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  template: `
    <mat-card class="table-wrapper-card">
      <!-- Toolbar Header -->
      <div class="table-toolbar">
        <div class="toolbar-title-wrap">
          @if (title) {
            <h2 class="table-title">{{ title }}</h2>
          }
          @if (subtitle) {
            <span class="table-subtitle">{{ subtitle }}</span>
          }
        </div>

        <div class="toolbar-actions">
          @if (showSearch) {
            <mat-form-field appearance="outline" class="search-field" subscriptSizing="dynamic">
              <mat-icon matPrefix>search</mat-icon>
              <input
                matInput
                [placeholder]="searchPlaceholder"
                (keyup)="onSearchChange($event)"
                #searchInput
              />
              @if (searchInput.value) {
                <button
                  mat-icon-button
                  matSuffix
                  (click)="searchInput.value = ''; searchChanged.emit('')"
                  aria-label="Clear filter"
                >
                  <mat-icon>clear</mat-icon>
                </button>
              }
            </mat-form-field>
          }

          <ng-content select="[table-actions]"></ng-content>

          @if (showRefresh) {
            <button
              mat-icon-button
              (click)="refreshClicked.emit()"
              matTooltip="Refresh data"
              [disabled]="loading"
            >
              <mat-icon>refresh</mat-icon>
            </button>
          }
        </div>
      </div>

      <!-- Loading Bar/Overlay -->
      @if (loading) {
        <div class="loading-overlay">
          <mat-spinner diameter="36"></mat-spinner>
          <span>Loading records...</span>
        </div>
      }

      <!-- Error State -->
      @if (errorMessage && !loading) {
        <div class="error-banner">
          <mat-icon>error_outline</mat-icon>
          <span>{{ errorMessage }}</span>
          <button mat-button color="warn" (click)="refreshClicked.emit()">Retry</button>
        </div>
      }

      <!-- Table Body Container -->
      <div class="table-content-container" [class.is-loading]="loading">
        <ng-content></ng-content>
      </div>

      <!-- Paginator Slot -->
      <div class="table-footer">
        <ng-content select="[table-footer]"></ng-content>
      </div>
    </mat-card>
  `,
  styles: [`
    .table-wrapper-card {
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .table-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .toolbar-title-wrap {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .table-title {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
    }

    .table-subtitle {
      font-size: 0.85rem;
      color: #64748b;
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .search-field {
      width: 260px;
    }

    .search-field ::ng-deep .mat-mdc-text-field-wrapper {
      padding-top: 0;
      padding-bottom: 0;
    }

    .loading-overlay {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1.5rem;
      background: #f8fafc;
      color: #64748b;
      font-size: 0.875rem;
      font-weight: 500;
      border-bottom: 1px solid #f1f5f9;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.5rem;
      background-color: #fef2f2;
      color: #b91c1c;
      border-bottom: 1px solid #fecaca;
      font-size: 0.875rem;
    }

    .table-content-container {
      overflow-x: auto;
      min-height: 120px;
    }

    .table-content-container.is-loading {
      opacity: 0.6;
      pointer-events: none;
    }

    .table-footer {
      border-top: 1px solid #f1f5f9;
    }

    @media (max-width: 640px) {
      .table-toolbar {
        flex-direction: column;
        align-items: stretch;
      }
      .search-field {
        width: 100%;
      }
    }
  `]
})
export class DataTableWrapperComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() loading = false;
  @Input() errorMessage: string | null = null;
  @Input() showSearch = true;
  @Input() searchPlaceholder = 'Filter records...';
  @Input() showRefresh = true;

  @Output() searchChanged = new EventEmitter<string>();
  @Output() refreshClicked = new EventEmitter<void>();

  onSearchChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchChanged.emit(val.trim().toLowerCase());
  }
}
