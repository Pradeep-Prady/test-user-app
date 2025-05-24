import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOtpInputModule } from 'ng-otp-input';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { AccountInformationComponent } from './partials/account-information/account-information.component';
import { SecurityComponent } from './partials/security/security.component';
import { PartialsModule } from '../../partials/partials.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageTfaComponent } from './partials/security/manage-tfa/manage-tfa.component';
import { SharedModule } from '../../../shared/shared.module';
import { PersonalVerificationComponent } from './partials/personal-verification/personal-verification.component';

@NgModule({
  declarations: [
    ProfileComponent,
    AccountInformationComponent,
    SecurityComponent,
    PersonalVerificationComponent,
    ManageTfaComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    PartialsModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgOtpInputModule,
  ],
})
export class ProfileModule {}
