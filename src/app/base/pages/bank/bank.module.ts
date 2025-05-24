import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankRoutingModule } from './bank-routing.module';
import { BankComponent } from './bank.component';
import { DepositComponent } from './partials/deposit/deposit.component';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { FiatComponent } from './partials/deposit/fiat/fiat.component';
import { CryptoComponent } from './partials/deposit/crypto/crypto.component';


@NgModule({
  declarations: [
    BankComponent,
    DepositComponent,
    FiatComponent,
    CryptoComponent
  ],
  imports: [
    CommonModule,
    BankRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class BankModule { }
