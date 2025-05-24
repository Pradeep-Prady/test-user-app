import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthHelperService } from '../../../auth/services/auth-helper.service';

@Component({
  selector: 'app-bank',
  standalone: false,
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss'],
})
export class BankComponent implements OnInit, OnDestroy {
  currentPage: string = '';
  balance: number = 0;

  private subscription: Subscription = new Subscription();

  constructor(
    private authHelper: AuthHelperService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth >= 1024 && this.router.url === '/bank') {
        this.router.navigate(['/bank/deposit']);
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
    this.subscription.add(
      this.authHelper.balance$.subscribe((balance) => {
        this.balance = balance.balance;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
