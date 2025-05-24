import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { AuthHelperService } from '../../../auth/services/auth-helper.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: false,
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentPage: string = '';
  isLoggedIn: any;

  private subscription: Subscription = new Subscription();

  constructor(
    // private cookieService: CookieService,
    private router: Router,
    private authHelper: AuthHelperService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth >= 1024 && this.router.url === '/profile') {
        this.router.navigate(['/profile/account-information']);
      }

      this.router.events
        .pipe(
          filter(
            (event): event is NavigationEnd => event instanceof NavigationEnd
          )
        )
        .subscribe((event) => {
          this.currentPage = event.urlAfterRedirects;
        });

      // Handle initial load
      this.currentPage = this.router.url;
    }
  }

  ngOnInit() {
    // Initial authentication check
    this.isLoggedIn = this.authHelper.isAuthenticated();

    // Subscribe to authentication state changes
    this.subscription.add(
      this.authHelper.authState$.subscribe((isAuthenticated) => {
        this.isLoggedIn = isAuthenticated;
      })
    );
  }

  logout() {
    this.authHelper.logout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
