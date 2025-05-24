// import {
//   Component,
//   EventEmitter,
//   Input,
//   Output,
//   OnInit,
//   OnDestroy,
// } from '@angular/core';
// import { ModalService } from '../../../../shared/services/modal.service';

// import { AuthHelperService } from '../../../../auth/services/auth-helper.service';
// import { BaseService } from '../../../services/base.service';
// import { interval, Subscription } from 'rxjs';
// export interface Language {
//   name: string;
//   key: string;
// }

// export interface Balance {
//   balance: number;
//   currency_symbol: string;
//   currency_name: string;
// }

// @Component({
//   selector: 'app-header',
//   standalone: false,
//   templateUrl: './header.component.html',
//   styleUrl: './header.component.scss',
// })
// export class HeaderComponent implements OnInit, OnDestroy {
//   @Output() openLanguageModel = new EventEmitter<void>();

//   showSignupModal = false;
//   showLoginModal = false;
//   showForgotPasswordModal = false;
//   // showLanguageSelector = false;

//   currentLanguage!: Language;

//   @Input() showLanguageSelector: boolean = false;

//   isLoggedIn: any;

//   private subscription: Subscription = new Subscription();
//   private pollingSubscription: Subscription | null = null;

//   balance: Balance = {
//     balance: 0,
//     currency_symbol: 'USD',
//     currency_name: 'USD',
//   };
//   currencySymbol: string | null = null;

//   constructor(
//     // private cookieService: CookieService,
//     public modalService: ModalService,
//     private authHelper: AuthHelperService,
//     private baseService: BaseService
//   ) {
//     this.isLoggedIn = this.authHelper.isAuthenticated();
//   }

//   ngOnInit() {
//     this.authHelper.language$.subscribe((lang) => {
//       this.currentLanguage = lang;
//     });

//     this.subscription.add(
//       this.authHelper.authState$.subscribe((isAuthenticated) => {
//         this.isLoggedIn = isAuthenticated;

//         if (this.isLoggedIn === true) {
//           this.getBalance();

//           // Stop any existing polling first
//           if (this.pollingSubscription) {
//             this.pollingSubscription.unsubscribe();
//           }

//           // Start polling every 5 seconds
//           this.pollingSubscription = interval(5000).subscribe(() =>
//             this.getBalance()
//           );
//         } else {
//           // If user logs out, stop polling
//           if (this.pollingSubscription) {
//             this.pollingSubscription.unsubscribe();
//             this.pollingSubscription = null;
//           }
//         }
//       })
//     );

//     this.subscription.add(
//       this.modalService.loginModal$.subscribe((show) => {
//         this.showLoginModal = show;
//       })
//     );
//   }

//   getBalance() {
//     this.baseService.getBalance().subscribe({
//       next: (response) => {
//         this.balance = response.result;
//         // this.balance = 123456.6789;
//         this.currencySymbol = response.result.currency_symbol;
//       },
//       error: (error) => {
//         console.error('Error fetching balance:', error);
//       },
//     });
//   }

//   ngOnDestroy() {
//     this.subscription.unsubscribe();
//   }

//   showLanguageDropdown = false;
//   selectedLanguage = 'En';

//   showDrawer = false;

//   toggleLanguageDropdown() {
//     this.openLanguageModel.emit();
//   }

//   closeLoginModal() {
//     this.modalService.hideLoginModal();
//   }

//   showForgotPassword() {
//     this.showLoginModal = false;
//     this.showSignupModal = false;
//     this.showForgotPasswordModal = true;
//   }

//   showLogin() {
//     this.showSignupModal = false;
//     this.showForgotPasswordModal = false;
//     this.modalService.showLoginModal();
//   }

//   drawer(show: boolean) {
//     if (!show) {
//       // First trigger the closing animation by updating a class
//       const drawerElement = document.querySelector(
//         '.w-full.h-full'
//       ) as HTMLElement;
//       if (drawerElement) {
//         drawerElement.classList.remove('open-left-modal-transition');
//         drawerElement.classList.add('close-left-modal-transition');
//       }
//       // Then hide the drawer after animation completes
//       setTimeout(() => {
//         this.showDrawer = show;
//       }, 100);
//     } else {
//       this.showDrawer = show;
//     }
//   }

//   showLanguageModel() {
//     this.showLanguageSelector = true;
//     this.drawer(false);
//   }
// }

import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ModalService } from '../../../../shared/services/modal.service';

import {
  AuthHelperService,
  Balance,
} from '../../../../auth/services/auth-helper.service';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../../pages/profile/services/profile.service';
export interface Language {
  name: string;
  key: string;
}

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() openLanguageModel = new EventEmitter<void>();

  showSignupModal = false;
  showLoginModal = false;
  showForgotPasswordModal = false;

  currentLanguage!: Language;

  @Input() showLanguageSelector: boolean = false;

  isLoggedIn: boolean = false;

  private subscription: Subscription = new Subscription();
  balance: number = 0;

  // balance: Balance = {
  //   balance: 0,
  //   currency_symbol: 'USD',
  //   currency_name: 'USD',
  // };
  currencySymbol: string | null = null;

  constructor(
    public modalService: ModalService,
    private authHelper: AuthHelperService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    // Subscribe to language changes
    this.subscription.add(
      this.authHelper.language$.subscribe((lang) => {
        this.currentLanguage = lang;
      })
    );

    // Subscribe to auth state changes
    this.subscription.add(
      this.authHelper.authState$.subscribe((isAuthenticated) => {
        this.isLoggedIn = isAuthenticated;
      })
    );

    // Subscribe to balance updates
    this.subscription.add(
      this.authHelper.balance$.subscribe((balance) => {
        this.balance = balance.balance;
        this.currencySymbol = balance.currency_symbol;
      })
    );

    // Subscribe to login modal state
    this.subscription.add(
      this.modalService.loginModal$.subscribe((show) => {
        this.showLoginModal = show;
      })
    );

    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.authHelper.setUser(res.result);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showLanguageDropdown = false;
  selectedLanguage = 'En';

  showDrawer = false;

  toggleLanguageDropdown() {
    this.openLanguageModel.emit();
  }

  closeLoginModal() {
    this.modalService.hideLoginModal();
  }

  showForgotPassword() {
    this.showLoginModal = false;
    this.showSignupModal = false;
    this.showForgotPasswordModal = true;
  }

  showLogin() {
    this.showSignupModal = false;
    this.showForgotPasswordModal = false;
    this.modalService.showLoginModal();
  }

  drawer(show: boolean) {
    if (!show) {
      // First trigger the closing animation by updating a class
      const drawerElement = document.querySelector(
        '.w-full.h-full'
      ) as HTMLElement;
      if (drawerElement) {
        drawerElement.classList.remove('open-left-modal-transition');
        drawerElement.classList.add('close-left-modal-transition');
      }
      // Then hide the drawer after animation completes
      setTimeout(() => {
        this.showDrawer = show;
      }, 100);
    } else {
      this.showDrawer = show;
    }
  }

  showLanguageModel() {
    this.showLanguageSelector = true;
    this.drawer(false);
  }
}
