import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GamesRoutingModule } from './games-routing.module';
import { CategoryComponent } from './category/category.component';
import { ProviderComponent } from './provider/provider.component';
import { GamesComponent } from './games.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartialsModule } from '../../partials/partials.module';

@NgModule({
  declarations: [CategoryComponent, ProviderComponent, GamesComponent],
  imports: [
    CommonModule,
    GamesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PartialsModule,
  ],
})
export class GamesModule {}
