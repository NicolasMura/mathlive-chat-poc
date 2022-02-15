import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CoreConstants } from '../core-constants';
import { UserService } from '../services/user.service';
import { UtilitiesService } from '../services/utilities.service';


@Injectable({
  providedIn: 'root'
})
export class UserLoggedGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private userService: UserService,
    private utilitiesService: UtilitiesService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.userService.usernameExists()) {
      return true;
    }

    console.log('UserLoggedGuard - User pas connecté - Accès non autorisé');
    this.router.navigate([CoreConstants.routePath.login], { queryParams: { returnUrl: state.url } });
    return false;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

}
