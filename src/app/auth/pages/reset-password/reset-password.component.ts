import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  @Output() closeModal = new EventEmitter<void>();

  password: string = '';
  confirmPassword: string = '';
  isPasswordReseted: boolean = false;

  token: string = '';

  passwordError: string = '';
  confirmPasswordError: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.route.params.subscribe((params) => {
      this.token = params['token'];
    });
  }

  reset() {
    // Clear previous errors
    this.passwordError = '';
    this.confirmPasswordError = '';

    // Password validations
    if (!this.password) {
      this.passwordError = 'Enter password';
    } else if (this.password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters long';
    } else if (!/[A-Z]/.test(this.password)) {
      this.passwordError =
        'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(this.password)) {
      this.passwordError =
        'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(this.password)) {
      this.passwordError = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*]/.test(this.password)) {
      this.passwordError =
        'Password must contain at least one special character (!@#$%^&*)';
    }

    // Confirm password validation
    if (!this.confirmPassword) {
      this.confirmPasswordError = 'Enter confirm your password';
    } else if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Make sure both password fields are Same.';
    }

    // If there are any errors, do not proceed
    if (this.passwordError || this.confirmPasswordError) {
      return;
    }

    // If all validations pass

    this.authService
      .resetPassword({ password: this.password, token: this.token })
      .subscribe({
        next: (res) => {
          if (res.status === true) {
            this.isPasswordReseted = true;
          } else {
            this.toastService.error(
              res.detail || 'Failed to reset password',
              3000
            );
          }
        },
        error: (err) => {
          const errorMessage =
            err?.error?.message || err?.error?.detail || 'Server error';

          this.toastService.error(errorMessage, 3000);
        },
      });
  }
}
