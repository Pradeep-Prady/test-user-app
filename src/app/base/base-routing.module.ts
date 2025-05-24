import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './base.component';
import { ProvidersComponent } from './pages/providers/providers.component';
import { LobbyComponent } from './pages/lobby/lobby.component';
import { BankComponent } from './pages/bank/bank.component';
import { LedgerComponent } from './pages/ledger/ledger.component';
import { BonusComponent } from './pages/bonus/bonus.component';
import { FaqComponent } from './pages/faq/faq.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'lobby' },

      {
        path: 'lobby',
        component: LobbyComponent,
      },
      {
        path: 'bank',
        loadChildren: () =>
          import('./pages/bank/bank.module').then((a) => a.BankModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'ledger',
        component: LedgerComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'bonus',
        component: BonusComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./pages/profile/profile.module').then((a) => a.ProfileModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'faq',
        component: FaqComponent,
      },

      {
        path: 'games/providers',
        component: ProvidersComponent,
      },
      {
        path: 'games',
        loadChildren: () =>
          import('./pages/games/games.module').then((a) => a.GamesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaseRoutingModule {}
