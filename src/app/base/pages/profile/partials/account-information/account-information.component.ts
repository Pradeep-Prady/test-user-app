import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { AuthHelperService } from '../../../../../auth/services/auth-helper.service';
export interface Language {
  name: string;
  key: string;
}
@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrl: './account-information.component.scss',
  standalone: false,
})
export class AccountInformationComponent implements OnInit {
  constructor(
    private profileService: ProfileService,
    private toastService: ToastService,
    private authHelper: AuthHelperService
  ) {}

  user: any;
  showLanguageModel: boolean = false;
  language!: Language;
  editModel: boolean = false;
  isLoading: boolean = false;

  firstname: string = '';
  lastname: string = '';
  dob: string = '';

  firstnameError: string = '';
  lastnameError: string = '';
  dobError: string = '';

  @Output() openLanguageModel = new EventEmitter<void>();
  @Output() closeCurrentPage = new EventEmitter<void>();
  getProfile() {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.user = res.result;
        // Set the form field values with user data
        this.firstname = this.user?.firstname || '';
        this.lastname = this.user?.lastname || '';
        this.dob = this.user?.dob || '';
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }
  ngOnInit() {
    this.getProfile();

    this.authHelper.language$.subscribe((lang) => {
      this.language = lang;
    });
  }

  openLanguageSelector() {
    this.showLanguageModel = true;
    this.openLanguageModel.emit();
  }

  update() {
    const nameRegex = /^[a-zA-Z]+$/;

    // Reset errors
    this.firstnameError = '';
    this.lastnameError = '';

    let isValid = true;

    if (!this.firstname) {
      this.firstnameError = 'First name cannot be empty.';
      isValid = false;
    }
    if (!nameRegex.test(this.firstname)) {
      this.firstnameError = 'First name must contain only letters (A-Z).';
      isValid = false;
    }

    if (!this.lastname) {
      this.lastnameError = 'Last name cannot be empty.';
      isValid = false;
    }
    if (!nameRegex.test(this.lastname)) {
      this.lastnameError = 'Last name must contain only letters (A-Z).';
      isValid = false;
    }

    if (!isValid) return;

    this.profileService
      .updateProfile(
        this.firstname.toLowerCase(),
        this.lastname.toLowerCase(),
        this.dob
      )
      .subscribe({
        next: (res) => {
          if (res.status === true) {
            this.getProfile();
            this.editModel = false;
            this.toastService.success(res.message, 2000);
          }
        },
        error: (err) => {
          this.toastService.error(err.error.message, 2000);
        },
      });
  }

  startEditing() {
    this.resetFormWithUserData();
    this.editModel = true;
  }

  resetFormWithUserData() {
    this.firstname = this.user?.firstname || '';
    this.lastname = this.user?.lastname || '';
    this.dob = this.user?.dob || '';

    this.firstnameError = '';
    this.lastnameError = '';
    this.dobError = '';
  }
}
