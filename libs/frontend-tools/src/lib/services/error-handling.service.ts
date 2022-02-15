import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { NotificationService } from './notification.service';


/**
 * Error Handling Service
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor(
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService
  ) { }

  /**
   * Centralized error management - User notifications display
   */
  handleError(error: any): void {
    let userErrorMsg = '';
    let errorStatus = -1;
    let errorUrl = '';

    userErrorMsg = error.message ?? 'Erreur inconnue';
    errorStatus = error.status ?? 0;
    errorUrl = error.url ?? '';

    switch (errorStatus) {
      // Here we could intercept API errors based on their status code, and show custom messages
      // case 500:
      //   // ...
      //   break;

      // case 401:
      //   // ...
      //   break;

      // ...

      case 0:
        // this error must be hidden to user if it is a login endpoint (error is managed in LoginComponent)
        if (errorUrl.indexOf('api/auth/token') !== -1) {
          // do nothing
        // this error must be hidden to user if it is due to an expired token
        } else if (!this.localStorageService.retrieve('tokenLocalStorage')) {
          // do nothing
        }
        else {
          this.notificationService.sendNotification(userErrorMsg, '', { panelClass: 'failure' });
        }
        break;

      default:
        this.notificationService.sendNotification(userErrorMsg, '', { panelClass: 'failure' });
        break;
    }
  }
}
