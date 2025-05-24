import { Routes } from '@angular/router';
import { EmailVerificationComponent } from './auth/pages/login/email-verification/email-verification.component';
import { ResetPasswordComponent } from './auth/pages/reset-password/reset-password.component';
import { NonAuthGuard } from './auth/guards/non-auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./base/base.module').then((b) => b.BaseModule),
  },
  {
    path: 'email_verification/:token',
    component: EmailVerificationComponent,
    // canActivate: [NonAuthGuard]
  },
  {
    path: 'reset_password/:token',
    component: ResetPasswordComponent,
    // canActivate: [NonAuthGuard]
  },

];
