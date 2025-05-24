// import { Injectable } from '@angular/core';
// import { CookieService } from 'ngx-cookie-service';
// import { Router } from '@angular/router';
// import { environment } from '../../../environments/environment';
// import { BehaviorSubject, Observable } from 'rxjs';

// export interface Language {
//   name: string;
//   key: string;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthHelperService {
//   private authStateSubject = new BehaviorSubject<boolean>(false);
//   public authState$: Observable<boolean> = this.authStateSubject.asObservable();

//   private languageSubject = new BehaviorSubject<Language>({ name: 'English', key: 'en' });
//   public language$: Observable<Language> = this.languageSubject.asObservable();

//   private readonly LANGUAGE_KEY = 'lang';

//   constructor(private cookieService: CookieService, private router: Router) {
//     this.authStateSubject.next(this.isAuthenticated());

//     // Load language from cookie if available
//     const savedLang = this.cookieService.get(this.LANGUAGE_KEY);
//     if (savedLang) {
//       try {
//         const parsedLang: Language = JSON.parse(savedLang);
//         this.languageSubject.next(parsedLang);
//       } catch {
//         // fallback
//         this.languageSubject.next({ name: 'English', key: 'en' });
//       }
//     }
//   }

//   // Token management
//   isAuthenticated(): boolean {
//     return !!this.cookieService.get(environment.token);
//   }

//   getToken(): string {
//     return this.cookieService.get(environment.token) || '';
//   }

//   setToken(token: string): void {
//     this.cookieService.set(environment.token, token, undefined, '/');
//     this.authStateSubject.next(true);
//   }

//   logout(redirectUrl: string = '/'): void {
//     this.cookieService.delete(environment.token, '/');
//     this.authStateSubject.next(false);
//     this.router.navigate([redirectUrl]);
//   }

//   // Language management
//   setLanguage(lang: Language): void {
//     this.languageSubject.next(lang);
//     this.cookieService.set(this.LANGUAGE_KEY, JSON.stringify(lang), undefined, '/');
//   }

//   getLanguage(): Language {
//     const saved = this.cookieService.get(this.LANGUAGE_KEY);
//     if (saved) {
//       try {
//         return JSON.parse(saved);
//       } catch {
//         return { name: 'English', key: 'en' };
//       }
//     }
//     return { name: 'English', key: 'en' };
//   }
// }

import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, Subscription, interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../base/services/base.service';

export interface Language {
  name: string;
  key: string;
}

export interface Balance {
  balance: number;
  currency_symbol: string;
  currency_name: string;
}

// Add at the top
export interface UserProfile {
  preferred_currency: string;
  currency_symbol: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthHelperService {
  private authStateSubject = new BehaviorSubject<boolean>(false);
  public authState$: Observable<boolean> = this.authStateSubject.asObservable();

  private languageSubject = new BehaviorSubject<Language>({
    name: 'English',
    key: 'en',
  });
  public language$: Observable<Language> = this.languageSubject.asObservable();

  // Add balance subject and observable
  private balanceSubject = new BehaviorSubject<Balance>({
    balance: 0,
    currency_symbol: 'USD',
    currency_name: 'USD',
  });
  public balance$: Observable<Balance> = this.balanceSubject.asObservable();

  private readonly LANGUAGE_KEY = 'lang';
  private pollingSubscription: Subscription | null = null;

  // Add inside the AuthHelperService class
  private userSubject = new BehaviorSubject<UserProfile | null>(null);
  public user$: Observable<UserProfile | null> =
    this.userSubject.asObservable();

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private http: HttpClient,
    private baseService: BaseService
  ) {
    const isAuthenticated = this.isAuthenticated();
    this.authStateSubject.next(isAuthenticated);

    // Load language from cookie if available
    const savedLang = this.cookieService.get(this.LANGUAGE_KEY);
    if (savedLang) {
      try {
        const parsedLang: Language = JSON.parse(savedLang);
        this.languageSubject.next(parsedLang);
      } catch {
        // fallback
        this.languageSubject.next({ name: 'English', key: 'en' });
      }
    }

    // If user is authenticated, start polling for balance
    if (isAuthenticated) {
      this.startBalancePolling();
    }
  }

  setUser(user: UserProfile): void {
    this.userSubject.next(user);
  }

  getCurrentUser(): UserProfile | null {
    return this.userSubject.getValue();
  }

  // Token management
  isAuthenticated(): boolean {
    return !!this.cookieService.get(environment.token);
  }

  getToken(): string {
    return this.cookieService.get(environment.token) || '';
  }

  setToken(token: string): void {
    this.cookieService.set(environment.token, token, undefined, '/');
    this.authStateSubject.next(true);

    // Start polling for balance when user logs in
    this.startBalancePolling();
  }

  logout(redirectUrl: string = '/'): void {
    this.cookieService.delete(environment.token, '/');
    this.authStateSubject.next(false);

    // Stop polling for balance when user logs out
    this.stopBalancePolling();

    // Reset balance
    this.balanceSubject.next({
      balance: 0,
      currency_symbol: 'USD',
      currency_name: 'USD',
    });

    this.router.navigate([redirectUrl]);
  }

  // Language management
  setLanguage(lang: Language): void {
    this.languageSubject.next(lang);
    this.cookieService.set(
      this.LANGUAGE_KEY,
      JSON.stringify(lang),
      undefined,
      '/'
    );
  }

  getLanguage(): Language {
    const saved = this.cookieService.get(this.LANGUAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { name: 'English', key: 'en' };
      }
    }
    return { name: 'English', key: 'en' };
  }

  // Balance management
  startBalancePolling(): void {
    // First get balance immediately
    this.getBalance();

    // Stop any existing polling subscription
    this.stopBalancePolling();

    // Start polling every 5 seconds
    this.pollingSubscription = interval(5000).subscribe(() => {
      this.getBalance();
    });
  }

  stopBalancePolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }

  getBalance(): void {
    if (!this.isAuthenticated()) {
      return;
    }

    this.baseService.getBalance().subscribe({
      next: (response) => {
        this.balanceSubject.next(response.result);
      },
      error: (error) => {
        console.error('Error fetching balance:', error);
      },
    });
  }

  getCurrentBalance(): Balance {
    return this.balanceSubject.getValue();
  }
}
