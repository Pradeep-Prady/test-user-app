import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseRoutingModule } from './base-routing.module';

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { BaseComponent } from './base.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MobileNavComponent } from './partials/components/mobile-nav/mobile-nav.component';
import { PartialsModule } from './partials/partials.module';

import { ProvidersComponent } from './pages/providers/providers.component';
import { RouterModule } from '@angular/router';
import { LobbyModule } from './pages/lobby/lobby.module';
import { BankComponent } from './pages/bank/bank.component';
import { BonusComponent } from './pages/bonus/bonus.component';
import { FaqComponent } from './pages/faq/faq.component';
import { LedgerComponent } from './pages/ledger/ledger.component';
import { ProfileModule } from './pages/profile/profile.module';
import { AuthInterceptor } from '../auth.interceptor';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    BaseComponent,
    BonusComponent,
    FaqComponent,
    LedgerComponent,
    ProvidersComponent,
  ],
  imports: [
    CommonModule,
    BaseRoutingModule,
    PartialsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MobileNavComponent,
    LobbyModule,
    ProfileModule,
    SharedModule,
    NgxPaginationModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class BaseModule {}
