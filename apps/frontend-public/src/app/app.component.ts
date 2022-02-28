import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment, IBuildInfos, User, UserService, UtilitiesService } from '@mlchat-poc/frontend-tools';
import { buildInfos } from '../build';

@Component({
  selector: 'mlchat-poc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'frontend-public';
  /**
   * build infos: hash, timestamp, user and jenkins Build Id
   * Allow use of buildInfos variable inside template, for display build infos
   */
  buildInfos: IBuildInfos;
  /**
   * Observable that gives current user
   */
  public currentUser$: Observable<User>;

  constructor(
    private userService: UserService,
    public utilitiesService: UtilitiesService
  ) {
    console.log(environment);
    this.buildInfos = buildInfos;

    console.log(
      `\n%cBuild Info:\n\n` +
        `%c ❯ Build env.: %c${
          environment.production ? 'production 🏭' : 'development 🚧'
        }\n` +
        `%c ❯ Build Version: ${buildInfos.jenkinsBuildNumber}\n` +
        ` ❯ Hash: ${buildInfos.hash}\n` +
        // ` ❯ User: ${buildInfos.user}\n` +
        ` ❯ Build Timestamp: ${buildInfos.timestamp}\n`,
      'font-size: 12px; color: #7c7c7b;',
      'font-size: 12px; color: #7c7c7b',
      environment.production
        ? 'font-size: 12px; color: #95c230;'
        : 'font-size: 12px; color: #e26565;',
      'font-size: 12px; color: #7c7c7b'
    );


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
