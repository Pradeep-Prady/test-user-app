import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';

interface HandlerStore {
  focusHandler?: EventListener;
  blurHandler?: EventListener;
}

interface OtpConfig {
  length?: number;
  allowNumbersOnly?: boolean;
  disableAutoFocus?: boolean;
  numInputs?: number;
  separator?: string;
  isPasswordInput?: boolean;
  inputStyles?: { [key: string]: string };
  containerClass?: string;
  inputClass?: string;
  focusOnLoad?: boolean;
  focusOnKey?: string;
  preventPaste?: boolean;
  allowKeyCodes?: string[];
}

@Component({
  selector: 'app-otp-input',
  standalone: false,
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.scss'],
})
export class OtpInputComponent implements AfterViewInit, OnDestroy {
  config = {
    length: 6,
    allowNumbersOnly: true,

    disableAutoFocus: false,
    numInputs: 6,
    separator: '',
    isPasswordInput: false,
    inputStyles: {
      width: '48px',
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
      transition: 'all 0.2s ease',
    },
    containerClass: 'otp-container',
    inputClass: 'otp-input',
    focusOnLoad: false,
    focusOnKey: 'tab',
    preventPaste: false,
    allowKeyCodes: ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'],
  };

  @Output() otpChange = new EventEmitter<string>();

  @ViewChild('otpWrapper') otpWrapper!: ElementRef;
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  private inputHandlers = new WeakMap<HTMLInputElement, HandlerStore>();
  otpValue: string = '';
  isRefocusing: boolean = false;

  constructor(private ngZone: NgZone, private renderer: Renderer2) {}

  onOtpChange(otp: string) {
    const wasEmpty = this.otpValue === '';
    const previousLength = this.otpValue.length;

    this.otpValue = otp || '';
    this.otpChange.emit(this.otpValue);

    if (!otp && previousLength === 1 && !this.isRefocusing) {
      this.isRefocusing = true;

      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.ngZone.run(() => {
            this.isRefocusing = false;
          });
        }, 50);
      });

      return;
    }

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

  applyGradientBorder(retries = 5) {
    if (!this.otpWrapper || !this.otpWrapper.nativeElement) {
      if (retries > 0) {
        setTimeout(() => this.applyGradientBorder(retries - 1), 200);
      }
      return;
    }

    const container = this.otpWrapper.nativeElement;
    const inputs = container.querySelectorAll('input');

    if (!inputs || inputs.length === 0) {
      if (retries > 0) {
        setTimeout(() => this.applyGradientBorder(retries - 1), 200);
      }
      return;
    }

    inputs.forEach((input: HTMLInputElement) => {
      const existingHandlers = this.inputHandlers.get(input);
      if (existingHandlers) {
        if (existingHandlers.focusHandler) {
          input.removeEventListener('focus', existingHandlers.focusHandler);
        }
        if (existingHandlers.blurHandler) {
          input.removeEventListener('blur', existingHandlers.blurHandler);
        }
      }

      const focusHandler = () => {
        this.renderer.setStyle(input, 'border', '2px solid transparent');
        this.renderer.setStyle(
          input,
          'background',
          'linear-gradient(#2B2E36, #2B2E36) padding-box, linear-gradient(90deg, #982929 0%, #d3a2a2 60%) border-box'
        );
      };

      const blurHandler = () => {
        this.renderer.setStyle(input, 'border', '2px solid transparent');
        this.renderer.setStyle(input, 'background', '#2B2E36');
      };

      this.inputHandlers.set(input, {
        focusHandler,
        blurHandler,
      });

      input.addEventListener('focus', focusHandler);
      input.addEventListener('blur', blurHandler);
    });

    this.addGradientStyleToHead();
  }

  addGradientStyleToHead() {
    if (document.getElementById('otp-style')) return;

    const styleEl = this.renderer.createElement('style');
    this.renderer.setAttribute(styleEl, 'id', 'otp-style');

    const styleContent = `
      .otp-input:focus {
        border: 2px solid transparent !important;
        background: linear-gradient(#2B2E36, #2B2E36) padding-box,
                    linear-gradient(90deg, #982929 0%, #d3a2a2 60%) border-box !important;
        outline: none;
      }
    `;
    this.renderer.appendChild(styleEl, this.renderer.createText(styleContent));
    this.renderer.appendChild(document.head, styleEl);
  }

  ngAfterViewInit() {
    setTimeout(() => this.applyGradientBorder(), 100);

    const observer = new MutationObserver(() => {
      this.applyGradientBorder();
    });

    if (this.otpWrapper?.nativeElement) {
      observer.observe(this.otpWrapper.nativeElement, {
        childList: true,
        subtree: true,
      });
    }

    setTimeout(() => observer.disconnect(), 3000);
  }

  ngOnDestroy() {
    try {
      if (this.otpWrapper && this.otpWrapper.nativeElement) {
        const inputs = this.otpWrapper.nativeElement.querySelectorAll('input');

        if (inputs && typeof inputs !== 'undefined' && inputs.length > 0) {
          Array.from(inputs).forEach((input: any) => {
            const handlers = this.inputHandlers.get(input);
            if (handlers) {
              if (handlers.focusHandler) {
                input.removeEventListener('focus', handlers.focusHandler);
              }
              if (handlers.blurHandler) {
                input.removeEventListener('blur', handlers.blurHandler);
              }
            }
          });
        }
      }
    } catch (error) {
      console.log('Error in ngOnDestroy:', error);
    }
  }
}
