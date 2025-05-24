import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { AuthHelperService } from '../../../../../auth/services/auth-helper.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss',
  standalone: false,
})
export class SecurityComponent implements OnInit {
  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private toastService: ToastService,
    private authHelper: AuthHelperService
  ) {}

  changePasswordModel: boolean = false;
  changePasswordSuccess: boolean = false;
  is_tfa_enabled: boolean = false;
  isLoading: boolean = false;

  checkOldPassword: boolean = false;

  currentPage = 'check-old-password';
  currentPassword: string = '';

  newPassword: string = '';
  confirmPassword: string = '';

  newPasswordError: string = '';
  confirmPasswordError: string = '';

  email_or_username: string = '';
  otpValue: string = '';

  getProfile() {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.is_tfa_enabled = res.result?.is_tfa_enabled || false;
        this.email_or_username = res.result?.email || '';

        this.isLoading = false;
        // setTimeout(() => {
        //   this.isLoading = false;
        // }, 1000);
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit() {
    this.getProfile();
  }

  checkCurrentPassword() {
    this.authService
      .login({
        email_or_username: this.email_or_username.toLowerCase(),
        password: this.currentPassword,
      })
      .subscribe({
        next: (res) => {
          if (!res.status) {
            // Credentials are incorrect
            this.toastService.error('Invalid Password', 2000);
            return;
          }

          this.currentPage = 'change-password';
        },
        error: (err) => {
          console.log(err, 'err');
          this.toastService.error('Invalid Password', 2000);
        },
      });
  }

  handleOtpChange(otp: string) {
    this.otpValue = otp;
  }
  change() {
    this.newPasswordError = '';
    this.confirmPasswordError = '';

    // Password validations
    if (!this.newPassword) {
      this.newPasswordError = 'Enter password';
    } else if (this.newPassword.length < 8) {
      this.newPasswordError = 'Password must be at least 8 characters long';
    } else if (!/[A-Z]/.test(this.newPassword)) {
      this.newPasswordError =
        'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(this.newPassword)) {
      this.newPasswordError =
        'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(this.newPassword)) {
      this.newPasswordError = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*]/.test(this.newPassword)) {
      this.newPasswordError =
        'Password must contain at least one special character (!@#$%^&*)';
    } else if (this.newPassword === this.currentPassword) {
      this.newPasswordError = 'New password cannot be same as current password';
    }

    // Confirm password validation
    if (!this.confirmPassword) {
      this.confirmPasswordError = 'Enter confirm password';
    } else if (this.newPassword !== this.confirmPassword) {
      this.confirmPasswordError = 'Make sure both password fields are Same.';
    }

    // If there are any errors, do not proceed
    if (this.newPasswordError || this.confirmPasswordError) {
      return;
    }

    if (this.is_tfa_enabled) {
      this.currentPage = 'tfa-enabled';
    } else {
      this.confirmTFA();
    }
  }

  confirmTFA() {
    this.profileService
      .changePassword(this.currentPassword, this.newPassword, this.otpValue)
      .subscribe({
        next: (res) => {
          if (res.status) {
            this.changePasswordSuccess = true;
            this.toastService.success(res.message, 2000);
            this.changePasswordModel = false;

            this.currentPassword = '';
            this.newPassword = '';
            this.confirmPassword = '';
            this.authHelper.logout();
          } else {
            this.toastService.error(res.message, 2000);
          }
        },
        error: (err) => {
          this.toastService.error(err.message, 2000);
        },
      });
  }

  backtoHome() {
    this.authHelper.logout();
  }

  closeModel() {
    this.changePasswordModel = false;

    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.currentPage = 'check-old-password';
  }
}
