import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankComponent } from './bank.component';
import { AuthGuard } from '../../../auth/guards';
import { DepositComponent } from './partials/deposit/deposit.component';

const routes: Routes = [
  {
    path: '',
    component: BankComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'deposit',
        component: DepositComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankRoutingModule {}
