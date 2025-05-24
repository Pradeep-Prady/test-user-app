import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyComponent } from './partials/currency/currency.component';
import { GridCardsComponent } from './partials/grid-cards/grid-cards.component';
import { Lotto60OriginalsComponent } from './partials/lotto60-originals/lotto60-originals.component';
import { RoundWinningsComponent } from './partials/round-winnings/round-winnings.component';
import { LobbyComponent } from './lobby.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriesComponent } from './partials/categories/categories.component';
import { PartialsModule } from '../../partials/partials.module';
import { ProvidersScrollComponent } from './partials/providers-scroll/providers-scroll.component';

@NgModule({
  declarations: [
    CurrencyComponent,
    GridCardsComponent,
    LobbyComponent,
    RoundWinningsComponent,
    Lotto60OriginalsComponent,
    CategoriesComponent,
    ProvidersScrollComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    PartialsModule,
  ],
  exports: [],
})
export class LobbyModule {}
