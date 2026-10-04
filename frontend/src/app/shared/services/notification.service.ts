import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'end',
    verticalPosition: 'bottom'
  };

  /**
   * Display a success message notification
   */
  showSuccess(message: string, action = 'OK', duration = 4000): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-success']
    });
  }

  /**
   * Display an error message notification
   */
  showError(message: string, action = 'Dismiss', duration = 6000): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-error']
    });
  }

  /**
   * Display an informational notification
   */
  showInfo(message: string, action = 'OK', duration = 4000): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-info']
    });
  }

  /**
   * Display a warning notification
   */
  showWarning(message: string, action = 'Got it', duration = 5000): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-warning']
    });
  }
}
