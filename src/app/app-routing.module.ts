import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NointernetComponent } from './partials/nointernet/nointernet.component';
import { PagenotfoundComponent } from './partials/pagenotfound/pagenotfound.component';
import { EmailVerificationComponent } from './auth/pages/login/email-verification/email-verification.component';
import { ResetPasswordComponent } from './auth/pages/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./base/base.module').then((b) => b.BaseModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((a) => a.AuthModule),
  },
  {
    path: 'email_verification/:token',
    component: EmailVerificationComponent,
  },
  {
    path: 'reset_password/:token',
    component: ResetPasswordComponent,
  },
  {
    path: 'no-internet',
    component: NointernetComponent,
  },
  { path: '**', pathMatch: 'full', component: PagenotfoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
