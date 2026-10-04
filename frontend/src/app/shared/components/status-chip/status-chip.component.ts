import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule],
  template: `
    <span class="status-chip" [ngClass]="badgeClass">
      <span class="dot"></span>
      {{ statusLabel }}
    </span>
  `,
  styles: [`
    .status-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.025em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .status-pending {
      background-color: #fef3c7;
      color: #92400e;
    }
    .status-pending .dot {
      background-color: #d97706;
    }

    .status-approved, .status-active {
      background-color: #d1fae5;
      color: #065f46;
    }
    .status-approved .dot, .status-active .dot {
      background-color: #059669;
    }

    .status-rejected, .status-cancelled {
      background-color: #fee2e2;
      color: #991b1b;
    }
    .status-rejected .dot, .status-cancelled .dot {
      background-color: #dc2626;
    }

    .status-submitted, .status-in-review {
      background-color: #e0e7ff;
      color: #3730a3;
    }
    .status-submitted .dot, .status-in-review .dot {
      background-color: #4f46e5;
    }

    .status-settled {
      background-color: #ede9fe;
      color: #5b21b6;
    }
    .status-settled .dot {
      background-color: #7c3aed;
    }

    .status-default {
      background-color: #f1f5f9;
      color: #475569;
    }
    .status-default .dot {
      background-color: #94a3b8;
    }
  `]
})
export class StatusChipComponent {
  @Input() status: string | undefined | null = 'PENDING';

  get badgeClass(): string {
    const s = (this.status || '').toUpperCase().replace(/\s+/g, '_');
    switch (s) {
      case 'PENDING':
        return 'status-pending';
      case 'APPROVED':
        return 'status-approved';
      case 'REJECTED':
        return 'status-rejected';
      case 'ACTIVE':
        return 'status-active';
      case 'CANCELLED':
        return 'status-cancelled';
      case 'SUBMITTED':
        return 'status-submitted';
      case 'IN_REVIEW':
        return 'status-in-review';
      case 'SETTLED':
        return 'status-settled';
      default:
        return 'status-default';
    }
  }

  get statusLabel(): string {
    if (!this.status) return 'UNKNOWN';
    return this.status.replace(/_/g, ' ');
  }
}
