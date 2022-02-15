import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment, User, UserService, UtilitiesService } from '@mlchat-poc/frontend-tools';


@Component({
  selector: 'mlchat-poc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'frontend-public';
  /**
   * Observable that gives current user
   */
  public currentUser$: Observable<User>;

  constructor(
    private userService: UserService,
    private utilitiesService: UtilitiesService
  ) {
    console.log(environment);

    // redirect user to calendar page if already logged
    this.userService.checkForExistingUsername();

    // subscribe to current user observable
    this.currentUser$ = this.userService.currentUser$;
  }

  ngOnInit(): void {
    // check if app is in maintenance mode
    this.utilitiesService.isAppInMaintenanceMode().subscribe((inMaintenance: boolean) => {
      // if (!inMaintenance) {
      //   this.authService.checkForExistingToken();
      // }
    }, error => {
      console.error(error);
    });
  }

  public logout(): void {
    this.userService.logout();
  }
}
