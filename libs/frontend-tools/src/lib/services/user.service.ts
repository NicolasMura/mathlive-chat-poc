import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, delay, map, timeout, tap } from 'rxjs/operators';
import { CoreConstants, environment, NotificationService, ErrorHandlingService, User } from '@mlchat-poc/frontend-tools';
import { GlobalService } from './global-service.service'; // strangely weird, but need to be imported like this...
import { WebSocketService } from './websocket.service';


/**
 * User Service
 * Providing user information and login status utilities
 */
@Injectable({
  providedIn: 'root'
})
export class UserService extends GlobalService {
  protected baseUrlUser = environment.backendApi.baseUrlUser;

  /**
   * Store currentUser in LocalStorage, allowing to retrieve credentials when application starts
   */
  @LocalStorage('currentUserLocalStorage') private currentUserLocalStorage: string | undefined;
  /**
   * Private current logged user, as a behavior subject so we can provide a default value
   * Nobody outside the UserService should have access to this BehaviorSubject
   */
  private readonly currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null as any);
  /**
   * Expose the observable$ part of the currentUser subject (read only stream)
   */
  readonly currentUser$: Observable<User> = this.currentUser.asObservable();
  /**
   * Users
   */
  public users: User[] = [];

  /**
   * Variables representing a part of application state, in a Redux inspired way
   */
  private userStore: {
    currentUser: User,
    users: User[]
  } = {
    currentUser: null as any,
    users: []
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private webSocketService: WebSocketService,
    protected notificationService: NotificationService,
    protected override errorHandlingService: ErrorHandlingService
  ) {
    super(errorHandlingService);
  }

  /**
   * Check at beginning if user is logged
   */
  public checkForExistingUsername(): void {
    if (this.usernameExists()) {
      // this.startSession(this.getCurrentUser());
      this.login(this.getCurrentUser()).subscribe((user: User) => {
        // console.log(user);
      }, error => {
        // @TODO : gestion fine des erreurs avec le backend + handleError()
        console.error(error);
        const userErrorMsg = error.message ? error.message + ' (connexion impossible)' : 'Erreur inconnue (connexion impossible)';
        this.notificationService.sendNotification(userErrorMsg, '', { panelClass: 'notification-login-by-username-error' });
      });
    }
  }

  /**
   * Login with username
   */
  public login(user: User): Observable<User> {
    const url = `${this.baseUrlUser}/login`;
    const body = user;

    return this.http.post<User>(url, body)
      .pipe(
        // delay(1000),
        timeout(10000),
        map((user: User) => new User(
          user.username || '',
          user.isModerator,
          // user.profile,
          `https://avatars.dicebear.com/api/avataaars/${user.username || 'bob'}.svg`
        )),
        tap((user: User) => this.startSession(user)),
        catchError(error => {
          if (error.error?.statusCode === 409) {
            this.cancelSession();
          }
          return this.handleError(error);
        })
      );
  }

  /**
   * Log out
   */
  public logout(): void {
    this.cancelSession();
  }

  /**
   * Get current user
   */
  public getCurrentUser(): User {
    if (this.currentUserLocalStorage) {
      return JSON.parse(this.currentUserLocalStorage) as User;
    }
    return this.currentUser.getValue();
  }

  /**
   * Set current user
   */
  public setCurrentUser(user: User): void {
    let newUser: User | null = null;

    if (user) {
      newUser = new User(
        user.username,
        user.isModerator,
        // user.profile,
        user.avatar
      );

      this.currentUserLocalStorage = JSON.stringify(user);
      this.userStore.currentUser = user;
      this.currentUser.next(Object.assign({}, this.userStore).currentUser);
    }
  }

  /**
   * Get all users
   */
  public getUsers(): User[] {
    return this.userStore.users;
  }

  /**
   * Get all users from backend
   */
  public getAllUsersFromBackend(): Observable<User[]> {
    const url = `${this.baseUrlUser}`;
    return this.http.get<User[]>(url)
      .pipe(
        delay(1000),
        map((users: User[]) => {
          const usersWellFormatted = users.map((user: User) => new User(
            user.username || '',
            user.isModerator,
            user.avatar
          ));

          this.users = usersWellFormatted;
          this.userStore.users = usersWellFormatted;

          return usersWellFormatted;
        }),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Start session
   */
  public startSession(user: User): void {
    console.log('Start session');

    // set current user
    this.setCurrentUser(user);

    // connect to WebSocket Server
    this.webSocketService.connect(user.username);
    // this.webSocketService.stopRetry = false;

    // go to home
    this.router.navigateByUrl(CoreConstants.routePath.root);
  }

  /**
   * Cancel session
   */
  public cancelSession(): void {
    console.log('Cancel session');

    // clear localstorage + clear and update application cache
    this.localStorageService.clear();
    this.userStore.currentUser = null as any;
    this.currentUser.next(Object.assign({}, this.userStore).currentUser);

    // remove current user
    this.setCurrentUser(null as any);

    // go to login
    this.router.navigate([CoreConstants.routePath.login]);

    // disconnect from WebSocket Server
    this.webSocketService.close();
    // this.webSocketService.stopRetry = true;
  }

  /**
   * Tell us if user is logged in
   */
  public usernameExists(): boolean {
    return this.getCurrentUser()?.username ? true : false;
  }
}
