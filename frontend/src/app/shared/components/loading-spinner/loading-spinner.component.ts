import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="spinner-wrapper" [class.overlay]="overlay">
      <mat-spinner [diameter]="diameter" [strokeWidth]="strokeWidth" color="primary"></mat-spinner>
      @if (message) {
        <p class="spinner-message">{{ message }}</p>
      }
    </div>
  `,
  styles: [`
    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2.5rem 1rem;
      gap: 1rem;
      color: #64748b;
    }

    .spinner-wrapper.overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.82);
      backdrop-filter: blur(2px);
      z-index: 50;
      border-radius: inherit;
    }

    .spinner-message {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 500;
      color: #475569;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() diameter = 44;
  @Input() strokeWidth = 4;
  @Input() message?: string;
  @Input() overlay = false;
}
