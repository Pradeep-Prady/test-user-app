import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  standalone: false,
})
export class ForgotPasswordComponent {
  @Input() showForgotPasswordModal = true;
  @Output() closeModal = new EventEmitter<void>();
  @Output() showLoginModal = new EventEmitter<void>();

  isforgotPasswordSent: boolean = false;
  email: string = '';
  emailError: string = '';

  constructor(
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  close() {
    this.closeModal.emit();
  }

  backToLogin() {
    // Close the forgot password modal and show login modal
    this.closeModal.emit();
    this.showLoginModal.emit();
  }

  validateEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  forgotPassword() {
    this.emailError = '';
    // Email validation
    if (!this.email) {
      this.emailError = 'Email is required';
    } else if (!this.validateEmail(this.email)) {
      this.emailError = 'Please enter a valid email address';
    }

    if (!this.emailError) {
      this.isforgotPasswordSent = true;
    }

    this.authService.forgotPassword({ email: this.email }).subscribe({
      next: (res) => {
        if (res.status === true) {
          this.isforgotPasswordSent = true;
          this.toastService.success('Password reset link sent to your email', 2000);
        } else {
          this.toastService.error(
            res.message || 'Failed to send password reset link', 2000
          );
        }
      },
      error: (err) => {
        this.toastService.error(
          err?.error?.detail || err?.message || 'Server error', 2000
        );
      },
    });
  }

  sendVerificationEmail() {
    this.forgotPassword();
    // this.isforgotPasswordSent = false;
  }
}
