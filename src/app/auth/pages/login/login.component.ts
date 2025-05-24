import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
// import { CookieService } from 'ngx-cookie-service';
import { ToastService } from '../../../shared/services/toast.service';
import { environment } from '../../../../environments/environment';
import { ModalService } from '../../../shared/services/modal.service';
import { AuthHelperService } from '../../services/auth-helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class LoginComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() showLoginModal = new EventEmitter<void>();
  @Output() showForgotPasswordModal = new EventEmitter<void>();
  @Output() showSignupModal = new EventEmitter<void>();

  email_or_username: string = '';
  password: string = '';
  currentPage: string = 'login';
  isEmailVerified: boolean = true;

  user: any;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    // private cookieService: CookieService,
    private modelService: ModalService,
    private authHelper: AuthHelperService
  ) {}

  emailError: string = '';
  passwordError: string = '';

  tfaCode: string[] = ['', '', '', '', '', ''];
  tfaDigits = Array(6);

  onTfaInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      input.value = value.replace(/[^\d]/g, '');
      return;
    }
    // Update the tfaCode array
    this.tfaCode[index] = value;
    // If a number is entered, move to next input
    if (value.length === 1) {
      setTimeout(() => {
        if (index < 5) {
          const nextInput = document.querySelector(
            `input[name="tfa${index + 1}"]`
          ) as HTMLInputElement;
          if (nextInput) {
            nextInput.focus();
          }
        }
      }, 0);
    }
  }

  onTfaBackspace(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    // If backspace is pressed and input is empty, move to previous input
    if (!input.value && index > 0) {
      this.tfaCode[index] = '';
      const prevInput = document.querySelector(
        `input[name="tfa${index - 1}"]`
      ) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  backToLogin() {
    this.currentPage = 'login';
    this.isEmailVerified = true;
  }

  close() {
    this.closeModal.emit();
  }

  backToSignup() {
    this.closeModal.emit();
    this.showSignupModal.emit();
  }

  forgotPassword() {
    this.showForgotPasswordModal.emit();
  }

  login() {
    this.emailError = '';
    this.passwordError = '';

    // Email validation
    if (!this.email_or_username) {
      this.emailError = 'Enter email address or username';
    } else if (
      !this.validateEmail(this.email_or_username) &&
      !/^[a-zA-Z0-9_]*$/.test(this.email_or_username)
    ) {
      this.emailError = 'Please enter a valid Email/Username';
    }

    // Password validation
    if (!this.password) {
      this.passwordError = 'Enter password';
    }
    // else if (this.password.length < 8) {
    //   this.passwordError = 'Password must be at least 8 characters long';
    // }

    // else if (!/[A-Z]/.test(this.password)) {
    //   this.passwordError =
    //     'Password must contain at least one uppercase letter';
    // } else if (!/[a-z]/.test(this.password)) {
    //   this.passwordError =
    //     'Password must contain at least one lowercase letter';
    // } else if (!/[0-9]/.test(this.password)) {
    //   this.passwordError = 'Password must contain at least one number';
    // } else if (!/[!@#$%^&*]/.test(this.password)) {
    //   this.passwordError =
    //     'Password must contain at least one special character';
    // }

    if (this.emailError || this.passwordError) {
      return;
    }

    this.authService
      .login({
        email_or_username: this.email_or_username.toLowerCase(),
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          if (!res.status) {
            // Credentials are incorrect
          this.tfaCode = ['', '', '', '', '', ''];

            this.toastService.error(
              res.error.message || 'Invalid email or password',
              2000
            );
            return;
          }

          // Credentials are correct, check email verification
          if (res.result.is_email_verified === false) {
            this.isEmailVerified = false;
            return;
          }

          // Email is verified, check TFA
          if (res.result.is_tfa_enabled) {
            this.currentPage = 'tfa';
            this.user = res.result;
            return;
          }

          // setToken
          this.authHelper.setToken(res.result.access_token);

          // All checks passed, login successful
          this.closeModal.emit();
          this.toastService.success('You have successfully logged in', 2000);
        },
        error: (err) => {
          // Default error message
          let errorMessage = 'Server error';

          // Handle 422 validation error from backend
          if (err?.status === 422 && Array.isArray(err?.error?.detail)) {
            errorMessage = err.error.detail[0]?.msg || errorMessage;
          } else {
            // Fallback to other error messages
            errorMessage = err?.error?.message || err?.message || errorMessage;
          }
          this.tfaCode = ['', '', '', '', '', ''];
       
          this.toastService.error(errorMessage, 2000);
        },
      });
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    const tld = domain.split('.').pop();
    if (!tld || !/^[a-zA-Z]{2,}$/.test(tld)) return false;
    if (!/^[a-zA-Z0-9._%+-]+$/.test(local)) return false;
    if (email.includes(' ')) return false;
    return true;
  }

  sendVerificationEmail() {
    this.authService
      .sendEmailVerification({
        email: this.email_or_username.toLowerCase(),
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          if (res.status === true) {
            this.toastService.success(
              'Your verification email has been sent',
              2000
            );
          } else {
            this.toastService.error(
              res.message || 'Failed to send verification email',
              2000
            );
          }
        },
        error: (err) => {
          this.toastService.error(
            err?.error?.message || err?.message || 'Server error',
            2000
          );
        },
      });
  }

  onTfaSubmit(otp: string) {
    this.authService
      .login({
        email_or_username: this.email_or_username.toLowerCase(),
        password: this.password,
        otp: otp,
      })
      .subscribe({
        next: (res) => {
          if (!res.status) {
            // Credentials are incorrect
            this.toastService.error(
              res.error.message || 'Invalid email or password',
              2000
            );
            return;
          }
         
          this.authHelper.setToken(res.result.access_token);

          // All checks passed, login successful
          this.closeModal.emit();
          this.toastService.success('You have successfully logged in', 2000);
        },
        error: (err) => {
         
          this.tfaCode = ['', '', '', '', '', ''];
          // This will catch 404 and other HTTP errors
          this.toastService.error(
            err?.error?.message || err?.message || 'Server error',
            2000
          );
        },
      });
  }
}
