import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-personal-verification',
  standalone: false,
  templateUrl: './personal-verification.component.html',
  styleUrls: ['./personal-verification.component.scss'],
})
export class PersonalVerificationComponent implements OnInit {
  firstname: string = '';
  lastname: string = '';
  dob: string = '';
  gender: string = '';
  email: string = '';

  firstNameError: string = '';
  lastNameError: string = '';
  dobError: string = '';
  genderError: string = '';
  isLoading: boolean = false;

  currentStatus: string = 'verification-setup';

  user: any;

  veriff_session_url: string = '';

  //  verification-setup

  // personal-details

  constructor(
    private profileService: ProfileService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.user = res.result;
        // Set the form field values with user data
        this.firstname = this.user?.firstname || '';
        this.lastname = this.user?.lastname || '';
        this.dob = this.user?.dob || '';
        this.email = this.user?.email || '';

        if (res.result.kyc_status === null) {
          this.currentStatus = 'verification-setup';
        }

        if (res.result.kyc_status === 'pending') {
          this.currentStatus = 'verification-pending';
          this.veriff_session_url = res.result.kyc_details.url;
        }

        if (res.result.kyc_status === 'submitted') {
          this.currentStatus = 'kyc-submitted';
        }

        if (res.result.kyc_status === 'expired') {
          this.currentStatus = 'kyc-expired';
        }

        if (res.result.kyc_status === 'rejected') {
          this.currentStatus = 'kyc-rejected';
        }

        if (
          res.result.kyc_status === 'approved' &&
          res.result.is_kyc_verified
        ) {
          this.currentStatus = 'kyc-approved';
        }

        this.isLoading = false;
      },

      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  onBirthDateChange(date: string) {
    if (date) {
      this.dobError = '';
    }
  }

  createKYCVerification() {
    // Clear previous errors
    this.firstNameError = '';
    this.lastNameError = '';
    this.dobError = '';
    this.genderError = '';

    // Validate form fields
    let hasError = false;

    if (this.firstname.trim() === '') {
      this.firstNameError = 'Firstname is required';
      hasError = true;
    }
    if (this.lastname.trim() === '') {
      this.lastNameError = 'Lastname is required';
      hasError = true;
    }
    if (this.dob.trim() === '') {
      this.dobError = 'Date of birth is required';
      hasError = true;
    }
    if (this.gender.trim() === '') {
      this.genderError = 'Gender is required';
      hasError = true;
    }

    if (hasError) {
      return; // Stop if there are validation errors
    }

    // Submit the KYC verification
    this.profileService
      .createKYCVerification(
        this.firstname,
        this.lastname,
        this.dob,
        this.gender
      )
      .subscribe({
        next: (res) => {
          if (res.result.veriff_session_url) {
            window.open(res.result.veriff_session_url, '_blank');
            this.veriff_session_url = res.result.veriff_session_url;
            this.currentStatus = 'verification-initiated';
          }
        },
        error: (err) => {
          console.log('Verification failed:', err);
          // Optional: Show error message to user
        },
      });
  }

  resendVerificationLink() {
    this.profileService
      .createKYCVerification(
        this.user.kyc_data.firstName,
        this.user.kyc_data.lastName,
        this.user.kyc_data.dateOfBirth,
        this.user.kyc_data.gender
      )
      .subscribe({
        next: (res) => {
          this.toastService.success(
            'Verification link has been sent to your email',
            2000
          );
        },
        error: (err) => {
          this.toastService.success(err.error.message, 2000);
        },
      });
  }
}
