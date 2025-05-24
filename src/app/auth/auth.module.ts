import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOtpInputModule } from 'ng-otp-input';
import { AuthComponent } from './auth.component';

//service
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthRoutingModule } from './auth-routing.module';

import { SignupComponent } from './pages/signup/signup.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { EmailVerificationComponent } from './pages/login/email-verification/email-verification.component';
import { TfaComponent } from './pages/login/tfa/tfa.component';
import { AuthHelperService } from './services/auth-helper.service';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SignupComponent,
    EmailVerificationComponent,
    TfaComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgOtpInputModule,
  ],
  exports: [
    LoginComponent,
    ForgotPasswordComponent,
    SignupComponent,
    TfaComponent,

  ],
})
export class AuthModule {}
