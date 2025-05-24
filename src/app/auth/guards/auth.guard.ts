import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { ModalService } from '../../shared/services/modal.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private modalService: ModalService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Check if the token exists in cookies
    const token = this.cookieService.get(environment.token);

    if (token) {
      // User is authenticated
      return true;
    }

    // User is not authenticated, show login modal instead of redirecting
    this.modalService.showLoginModal();
    return false; // Prevent navigation to the protected route
  }
}
