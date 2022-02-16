import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CoreConstants, NotificationService, UserService } from '@mlchat-poc/frontend-tools';
import { User } from '@mlchat-poc/models';


/**
 * Component that displays login form
 */
@Component({
  selector: 'mlchat-poc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  loginLoadingSpinner = false;
  loginError = '';
  get usernameInput(): AbstractControl | null { return this.loginForm.get('username'); }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Redirect already logged user to home
    if (this.userService.getCurrentUser()) {
      this.router.navigateByUrl(CoreConstants.routePath.root);
    }

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]]
    });
  }

  public login(): void {
    this.loginForm.disable();
    this.loginLoadingSpinner = true;
    this.loginError = '';

    const newUser = new User(
      this.loginForm.get('username')?.value,
      false,
      `https://avatars.dicebear.com/api/adventurer/${this.loginForm.get('username')?.value}.svg`
    );

    this.userService.login(newUser).subscribe((user: User) => {
      console.log(user);
    }, error => {
      // @TODO : gestion fine des erreurs avec le backend + handleError()
      console.error(error.error);
      this.loginLoadingSpinner = false;
      this.loginError = error.error?.message ? error.error.message : 'Erreur : connexion impossible (le serveur semble injoignable :/)';
      this.loginForm.enable();
      const userErrorMsg = error.error?.message ? error.error.message + ' (connexion impossible)' : 'Erreur inconnue (connexion impossible)';
      this.notificationService.sendNotification(userErrorMsg, '', { panelClass: 'notification-login-by-username-error' });
    });
  }

  /*
   * Handle form errors
   */
  public errorHandling = (control: string, error: string) => {
    return this.loginForm.controls[control].hasError(error);
  }
}
