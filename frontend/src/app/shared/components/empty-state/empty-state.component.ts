import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="empty-state-container">
      <div class="icon-circle">
        <mat-icon>{{ icon }}</mat-icon>
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-description">{{ description }}</p>
      @if (actionLabel) {
        <button mat-raised-button color="primary" (click)="actionClicked.emit()" class="empty-action-btn">
          @if (actionIcon) {
            <mat-icon>{{ actionIcon }}</mat-icon>
          }
          <span>{{ actionLabel }}</span>
        </button>
      }
    </div>
  `,
  styles: [`
    .empty-state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 3.5rem 1.5rem;
      color: #64748b;
    }

    .icon-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background-color: #f1f5f9;
      color: #94a3b8;
      margin-bottom: 1.25rem;
    }

    .icon-circle mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
    }

    .empty-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .empty-description {
      font-size: 0.9rem;
      color: #64748b;
      margin: 0 0 1.5rem 0;
      max-width: 460px;
      line-height: 1.5;
    }

    .empty-action-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 600;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'No items found';
  @Input() description = 'There is currently no data to display here.';
  @Input() actionLabel?: string;
  @Input() actionIcon?: string;
  @Output() actionClicked = new EventEmitter<void>();
}
