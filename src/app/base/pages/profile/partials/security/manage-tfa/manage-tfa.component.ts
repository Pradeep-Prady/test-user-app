import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { ToastService } from '../../../../../../shared/services/toast.service';
// import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthHelperService } from '../../../../../../auth/services/auth-helper.service';

interface HandlerStore {
  focusHandler?: EventListener;
  blurHandler?: EventListener;
}
@Component({
  selector: 'app-manage-tfa',
  templateUrl: './manage-tfa.component.html',
  styleUrl: './manage-tfa.component.scss',
  standalone: false,
})
export class ManageTfaComponent implements OnInit {
  private inputHandlers = new WeakMap<HTMLInputElement, HandlerStore>();

  constructor(
    private profileService: ProfileService,
    private toastService: ToastService,
    private ngZone: NgZone,
    // private cookieService: CookieService,
    private renderer: Renderer2,
    private authHelper: AuthHelperService,
    private router: Router,

    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  @ViewChild('otpWrapper') otpWrapper!: ElementRef;
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  showTFAModel: boolean = false;
  qrImage: string = '';
  secretKey: string = '';

  email_or_username: string = '';

  isTFAEnabled = undefined;

  disableTFAModel = false;
  isLoading: boolean = false;

  otpValue: string = '';
  isRefocusing: boolean = false; // Flag to prevent recursive refocusing

  handleOtpChange(otp: string) {
    this.otpValue = otp;
  }

  showCopySuccess: boolean = false;

  copySecretKey() {
    navigator.clipboard.writeText(this.secretKey);

    this.showCopySuccess = true;

    setTimeout(() => {
      this.showCopySuccess = false;
    }, 2000);
  }

  enableTFA() {
    this.profileService.generateTFA('GA').subscribe({
      next: (res) => {
        this.showTFAModel = true;

        this.qrImage = res.result.qrcode;
        this.secretKey = res.result.secret;
      },
      error: (err) => {
        this.otpValue = '';
        this.toastService.error(err.error.message, 2000);
      },
    });
  }

  openDisabelModel() {
    this.disableTFAModel = true;
  }

  disableTFA() {
      this.profileService
      .enableTFA('GA', this.secretKey, this.otpValue)
      .subscribe({
    // this.profileService.enableTFA('GA', '', this.otpValue).subscribe({
      next: (res) => {
        if (res.status) {
          this.profileService.disableTFA().subscribe({
            next: (response) => {
              if (response.status) {
                // this.getProfile();
                this.disableTFAModel = false;
                this.toastService.success(
                  'TFA has been disabled, you will be logged out',
                  2000
                );

                this.authHelper.logout();
              } else {
                this.toastService.error(res.message, 2000);
              }
            },
            error: (err) => this.toastService.error(err.error.message, 2000),
          });
        } else {
          this.toastService.error(res.message, 2000);
        }
      },
      error: (err) => this.toastService.error(err.error.message, 2000),
    });
  }

  getProfile() {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.email_or_username = res.result?.email || '';
        this.isTFAEnabled = res.result?.is_tfa_enabled;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
      },
    });
  }

  ngOnInit() {
    this.getProfile();
  }

  confirmTFA() {
    this.profileService
      .enableTFA('GA', this.secretKey, this.otpValue)
      .subscribe({
        next: (res) => {
          if (res.result.token) {
            this.toastService.success(
              'TFA has been enabled, you will be logged out',
              2000
            );

            this.authHelper.logout();
          }
        },
        error: (err) => {
          this.toastService.error(err.error.message, 2000);
          this.otpValue = '';
        },
      });
  }
}
