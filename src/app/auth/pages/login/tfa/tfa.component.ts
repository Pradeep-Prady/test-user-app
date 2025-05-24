// tfa.component.ts - Fixed approach
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  ElementRef,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-tfa',
  templateUrl: './tfa.component.html',
  styleUrls: ['./tfa.component.scss'],
  standalone: false,
})
export class TfaComponent implements AfterViewInit, OnDestroy {
  @Output() closeModal = new EventEmitter<void>();
  @Output() showLoginModal = new EventEmitter<void>();
  @Output() otpSubmit = new EventEmitter<string>();
  @Input() user: any;
  @ViewChild('otpWrapper') otpWrapper!: ElementRef;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private ngZone: NgZone // Add NgZone for managing the focus operation
  ) {}

  otpValue: string = '';
  isRefocusing: boolean = false; // Flag to prevent recursive refocusing
  otpConfig = {
    length: 6,
    allowNumbersOnly: true,
    disableAutoFocus: false,
    numInputs: 6,
    separator: '',
    isPasswordInput: false,
    inputStyles: {
      width: '48px ',
      height: '48px',
      background: '#2B2E36',
      color: '#fff',
      fontSize: '1.5rem',
      textAlign: 'center',
      borderRadius: '6px',
      outline: 'none',
      margin: '0 4px',
      position: 'relative',
      zIndex: '1',
      border: '2px solid transparent',
      backgroundClip: 'padding-box',
      boxShadow: '0 0 0 3px transparent',
      transition: 'border 0.2s, box-shadow 0.2s',
    },
    containerClass: 'otp-container',
    inputClass: 'otp-input ',
    focusOnLoad: false,
    focusOnKey: 'tab',
    preventPaste: false,
    allowKeyCodes: ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'],
  };

  ngAfterViewInit() {
    setTimeout(() => {
      this.applyGradientBorder();
    }, 200);
  }

  applyGradientBorder() {
    if (!this.otpWrapper) return;
    const container = this.otpWrapper.nativeElement;
    const inputs = container.querySelectorAll('input');
    if (inputs.length === 0) {
      setTimeout(() => this.applyGradientBorder(), 200);
      return;
    }
    inputs.forEach((input: HTMLInputElement) => {
      input.addEventListener('focus', () => {
        input.style.border = '2px solid transparent';
        input.style.backgroundImage =
          'linear-gradient(#2B2E36, #2B2E36), linear-gradient(90deg, #982929 0%, #d3a2a2 60%)';
        input.style.backgroundOrigin = 'border-box';
        input.style.backgroundClip = 'padding-box, border-box';
      });
      input.addEventListener('blur', () => {
        input.style.border = '2px solid transparent';
        input.style.backgroundImage = 'none';
      });
    });
  }

  onOtpChange(otp: string) {
    // Store previous value to detect complete deletion
    const wasEmpty = this.otpValue === '';
    const previousLength = this.otpValue.length;

    // Update current value
    this.otpValue = otp || '';

    // Check if we're completely deleting the OTP
    // Don't try to refocus when the first digit is being removed
    if (!otp && previousLength === 1 && !this.isRefocusing) {
      // Prevent default behavior when clearing the last digit
      this.isRefocusing = true;

      this.ngZone.runOutsideAngular(() => {
        // Slightly longer timeout to ensure component state is stable
        setTimeout(() => {
          this.ngZone.run(() => {
            this.isRefocusing = false;
          });
        }, 50);
      });

      return; // Exit early to prevent focus logic
    }

    // Standard refocus logic for other scenarios
    // Don't refocus if already trying to refocus or if otp isn't empty
    if (otp === '' && !wasEmpty && !this.isRefocusing && previousLength > 1) {
      this.isRefocusing = true;

      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          if (!this.otpWrapper || !this.otpWrapper.nativeElement) {
            this.isRefocusing = false;
            return;
          }

          const inputs =
            this.otpWrapper.nativeElement.querySelectorAll('input');
          if (inputs && inputs.length > 0) {
            this.ngZone.run(() => {
              try {
                // Only focus if we're really empty
                if (this.otpValue === '') {
                  inputs[0].focus();
                }
              } catch (e) {
                console.log('Focus error handled:', e);
              } finally {
                this.isRefocusing = false;
              }
            });
          } else {
            this.isRefocusing = false;
          }
        }, 50);
      });
    }
  }

  validateForm(): boolean {
    return this.otpValue.length === 6;
  }

  submitCode() {
    if (this.validateForm()) {
      this.otpSubmit.emit(this.otpValue);
    }
  }

  close() {
    this.closeModal.emit();
  }

  // Add cleanup method to prevent memory leaks
  ngOnDestroy() {
    if (this.otpWrapper && this.otpWrapper.nativeElement) {
      const inputs = this.otpWrapper.nativeElement.querySelectorAll('input');
      if (inputs && inputs.length > 0) {
        inputs.forEach((input: HTMLInputElement) => {
          // Remove event listeners to prevent memory leaks
          input.removeEventListener('focus', () => {});
          input.removeEventListener('blur', () => {});
        });
      }
    }
  }
}
