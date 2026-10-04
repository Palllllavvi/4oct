import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    @if (visible) {
      <div class="alert-box" [ngClass]="'alert-' + type" role="alert">
        <mat-icon class="alert-icon">{{ iconName }}</mat-icon>
        <div class="alert-content">
          @if (title) {
            <strong class="alert-title">{{ title }}</strong>
          }
          <div class="alert-message">
            <ng-content></ng-content>
            @if (message) {
              <span>{{ message }}</span>
            }
          </div>
        </div>
        @if (dismissible) {
          <button mat-icon-button (click)="dismiss()" class="dismiss-btn" aria-label="Dismiss alert">
            <mat-icon>close</mat-icon>
          </button>
        }
      </div>
    }
  `,
  styles: [`
    .alert-box {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      padding: 0.875rem 1.25rem;
      border-radius: 8px;
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 1rem;
      transition: all 0.2s ease-in-out;
    }

    .alert-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .alert-content {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .alert-title {
      font-weight: 700;
      margin-bottom: 0.15rem;
    }

    .alert-message {
      color: inherit;
    }

    .dismiss-btn {
      width: 28px;
      height: 28px;
      line-height: 28px;
      margin: -4px -8px -4px 0;
      opacity: 0.7;
    }

    .dismiss-btn:hover {
      opacity: 1;
    }

    .dismiss-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Success */
    .alert-success {
      background-color: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }
    .alert-success .alert-icon {
      color: #059669;
    }

    /* Error */
    .alert-error {
      background-color: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }
    .alert-error .alert-icon {
      color: #dc2626;
    }

    /* Warning */
    .alert-warning {
      background-color: #fffbeb;
      color: #92400e;
      border: 1px solid #fde68a;
    }
    .alert-warning .alert-icon {
      color: #d97706;
    }

    /* Info */
    .alert-info {
      background-color: #eff6ff;
      color: #1e40af;
      border: 1px solid #bfdbfe;
    }
    .alert-info .alert-icon {
      color: #2563eb;
    }
  `]
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() title?: string;
  @Input() message?: string;
  @Input() dismissible = false;
  @Output() dismissed = new EventEmitter<void>();

  visible = true;

  get iconName(): string {
    switch (this.type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  }

  dismiss(): void {
    this.visible = false;
    this.dismissed.emit();
  }
}
