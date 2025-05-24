import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { AccountInformationComponent } from './partials/account-information/account-information.component';
import { SecurityComponent } from './partials/security/security.component';
import { PersonalVerificationComponent } from './partials/personal-verification/personal-verification.component';
import { AuthGuard } from '../../../auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'account-information',
        component: AccountInformationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'security',
        component: SecurityComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'personal-verification',
        component: PersonalVerificationComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
