import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

interface SelectOption {
  value: string;
  label: string;
  flag?: string;
  currency: string;
  disabled?: boolean;

  currency_key?: string;
  id?: string;
  is_fiat?: boolean;
  name?: string;
  symbol?: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  standalone: false,
})

export class SignupComponent implements OnInit {
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() showSignupModal = new EventEmitter<void>();
  @Output() showLoginModal = new EventEmitter<void>();

  closeSignupModal: boolean = false;
  nextPage: boolean = false;
  isSignupSuccess: boolean = false;
  currentPage: string = 'signup';
  isLoading = false;
  usernameExists: boolean = true;

  constructor(
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  // Show success message

  backToLogin() {
    this.closeModal.emit();
    this.showLoginModal.emit();
  }

  email: string = '';
  password: string = '';
  username: string = '';
  firstName: string = '';
  lastName: string = '';
  birthDate: string = '';
  currency: string = '';
  terms: boolean = false;
  isPasswordValid: boolean = false;

  emailError: string = '';
  passwordError: string = '';
  usernameError: string = '';
  firstNameError: string = '';
  lastNameError: string = '';
  birthDateError: string = '';
  currencyError: string = '';
  termsError: string = '';

  currencyOptions: SelectOption[] = [];

  onPasswordChange() {
    if (!this.password) {
      this.passwordError = '';
      this.isPasswordValid = false;
      return;
    }

    if (this.password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters';
      this.isPasswordValid = false;
    } else if (!/[A-Z]/.test(this.password)) {
      this.passwordError =
        'Password must contain at least one uppercase letter';
      this.isPasswordValid = false;
    } else if (!/[a-z]/.test(this.password)) {
      this.passwordError =
        'Password must contain at least one lowercase letter';
      this.isPasswordValid = false;
    } else if (!/[0-9]/.test(this.password)) {
      this.passwordError = 'Password must contain at least one number';
      this.isPasswordValid = false;
    } else if (!/[!@#$%^&*]/.test(this.password)) {
      this.passwordError =
        'Password must contain at least one special character';
      this.isPasswordValid = false;
    } else {
      this.passwordError = '';
      this.isPasswordValid = true;
    }
  }

  onUsernameChange() {
    if (!this.username) {
      this.usernameError = '';
      this.usernameExists = false;
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
    if (!usernameRegex.test(this.username)) {
      this.usernameError =
        'Username can only contain letters, numbers, and underscores, and must be between 4 and 20 characters';
      this.usernameExists = true;
      return;
    }
    if (this.username.includes('@')) {
      this.usernameError = 'Username cannot be an email address';
      this.usernameExists = true;
      return;
    }

    // Check username existence
    this.authService.usernameCheck({ username: this.username.toLowerCase() }).subscribe({
      next: (res: any) => {
        if (res.status === false) {
          this.usernameExists = true;
          this.usernameError = res.message || 'Username already exists';
        } else {
          this.usernameExists = false;
          this.usernameError = '';
        }
      },
      error: (err: any) => {
        if (err.status === 409 && err.error && err.error.status === false) {
          this.usernameExists = true;
          this.usernameError = err.error.message || 'Username already exists';
        } else {
          this.usernameExists = false;
          this.usernameError = '';
        }
      },
    });
  }

  onBirthDateChange(date: string) {
    if (date) {
      this.birthDateError = '';
    }
  }

  close() {
    this.closeModal.emit();
  }

  ngOnInit(): void {
    this.authService.getCurrencies().subscribe((res: any) => {
      this.currencyOptions = res.result
        .filter((currency: any) => currency.is_fiat)
        .map((currency: any) => ({
          value: currency.id,
          label: currency.name,
          flag: currency.flag,
          currency: currency.currency_key,
        }));
    });
  }

  goToNextPage() {
    this.emailError = '';
    this.passwordError = '';
    this.usernameError = '';
    // === Page 1 Validation ===
    let page1Valid = true;
    if (!this.email) {
      this.emailError = 'Enter email address';
      page1Valid = false;
    } else if (!this.validateEmail(this.email)) {
      this.emailError = 'Enter a valid email address: name@example.com';
      page1Valid = false;
    }

    const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
    if (!this.username) {
      this.usernameError = 'Enter username';
      page1Valid = false;
    } else if (!usernameRegex.test(this.username)) {
      this.usernameError =
        'Username can only contain letters, numbers, and underscores, and must be between 4 and 20 characters';
      page1Valid = false;
    } else if (this.username.includes('@')) {
      this.usernameError = 'Username cannot be an email address';
      page1Valid = false;
    }

    if (!this.password) {
      this.passwordError = 'Enter password';
      page1Valid = false;
    } else if (this.password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters';
      page1Valid = false;
    } else if (!/[A-Z]/.test(this.password)) {
      this.passwordError =
        'Password must contain at least one uppercase letter';
      page1Valid = false;
    } else if (!/[a-z]/.test(this.password)) {
      this.passwordError =
        'Password must contain at least one lowercase letter';
      page1Valid = false;
    } else if (!/[0-9]/.test(this.password)) {
      this.passwordError = 'Password must contain at least one number';
      page1Valid = false;
    } else if (!/[!@#$%^&*]/.test(this.password)) {
      this.passwordError =
        'Password must contain at least one special character';
      page1Valid = false;
    }

    if (!page1Valid) {
      this.nextPage = false;
      return;
    }

    // Check username existence
    this.authService.usernameCheck({ username: this.username.toLowerCase() }).subscribe({
      next: (res: any) => {
        if (res.status === false) {
          this.usernameExists = true;
          this.usernameError = res.message || 'Username already exists';
          this.nextPage = false;
          return;
        }
        this.usernameExists = false;
        this.usernameError = '';
        this.nextPage = true;
      },
      error: (err: any) => {
        if (err.status === 409 && err.error && err.error.status === false) {
          console.log(err.error, 'err.error');
          this.usernameExists = true;
          this.usernameError = err.error.message || 'Username already exists';
          this.nextPage = false;
          return;
        }
        this.nextPage = true;
      },
    });
  }

  signup() {
    this.firstNameError = '';
    this.lastNameError = '';
    this.birthDateError = '';
    this.currencyError = '';
    this.termsError = '';

    // === Page 2 Validation ===
    let page2Valid = true;

    if (!this.firstName) {
      this.firstNameError = 'Enter first name';
      page2Valid = false;
    }

    if (!this.lastName) {
      this.lastNameError = 'Enter last name';
      page2Valid = false;
    }

    if (!this.birthDate) {
      this.birthDateError = 'Select your birth date';
      page2Valid = false;
    }

    if (!this.currency) {
      this.currencyError = 'Select your currency';
      page2Valid = false;
    }

    if (!this.terms) {
      this.termsError = '*Please consent to our terms and conditions';
      page2Valid = false;
    }
    if (this.birthDate) {
      const today = new Date();
      const birthDate = new Date(this.birthDate);
      let ageDiff = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        ageDiff--;
      }
      if (ageDiff < 18) {
        this.birthDateError = 'You must be at least 18 years old';
        page2Valid = false;
      }
    }

    if (!page2Valid) {
      this.nextPage = true;
      return;
    }

    this.isLoading = true;

    this.authService
      .signUp({
        email: this.email.toLocaleLowerCase(),
        username: this.username.toLocaleLowerCase(),
        password: btoa(this.password),
        firstName: this.firstName.toLocaleLowerCase(),
        lastName: this.lastName.toLocaleLowerCase(),
        dob: this.birthDate,
        preferred_currency: this.currency,
      })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.currentPage = 'success';
          }
        },
        error: (err) => {
          this.toastService.error(
            err?.error?.message || err?.message || 'Server error',
            3000
          );
          this.isLoading = false;
        },
      });
  }

  // ... existing code ...
  validateEmail(email: string): boolean {
    // Basic email regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Reject consecutive dots, dots at start/end, or dots before/after @
    if (!re.test(email)) return false;
    if (email.includes('..')) return false;
    if (/\.@|@\./.test(email)) return false;
    if (email.startsWith('.') || email.endsWith('.')) return false;
    // Reject if any part (local or domain) ends with a dot or comma
    const [local, domain] = email.split('@');
    if (!local || !domain) return false;
    if (
      local.endsWith('.') ||
      local.endsWith(',') ||
      domain.endsWith('.') ||
      domain.endsWith(',')
    )
      return false;
    // Reject invalid TLDs
    const tld = domain.split('.').pop();
    if (!tld || !/^[a-zA-Z]{2,}$/.test(tld)) return false;
    // Reject invalid characters in the local part
    if (!/^[a-zA-Z0-9._%+-]+$/.test(local)) return false;
    // Reject spaces in the email
    if (email.includes(' ')) return false;
    return true;
  }

  sendVerificationEmail() {
    this.isLoading = true;
    this.authService
      .sendEmailVerification({
        email: this.email.toLowerCase(),
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          if (res.status === true) {
            this.toastService.success(
              'Your verification email has been sent',
              3000
            );
            this.isLoading = false;
          } else {
            this.toastService.error(
              res.message || 'Failed to send verification email',
              3000
            );
            this.isLoading = false;
          }
        },
        error: (err) => {
          this.toastService.error(
            err?.error?.detail || err?.message || 'Server error',
            3000
          );
          this.isLoading = false;
        },
      });
  }
}
