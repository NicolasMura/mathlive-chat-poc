import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';


/**
 * Notification Service
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  snackBarRef: SimpleSnackBar | undefined;

  constructor(
    private snackBar: MatSnackBar
  ) { }

  sendNotification(message: string, action?: string | undefined, options?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    const newNotification = this.snackBar.open(
      message,
      action,
      {
        duration: action ? 0 : (options && options.duration ? options.duration : 5000),
        panelClass: options && options.panelClass ?
          (options.panelClass instanceof Array ?
            ['zphotos-theme', ...options.panelClass] : ['zphotos-theme', options.panelClass])
          : ['zphotos-theme']
      }
    );
    return newNotification;
  }
}
