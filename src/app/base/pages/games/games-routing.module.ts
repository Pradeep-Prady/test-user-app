import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesComponent } from './games.component';
import { CategoryComponent } from './category/category.component';
import { ProviderComponent } from './provider/provider.component';

const routes: Routes = [
  {
    path: '',
    component: GamesComponent,
    children: [
      {
        path: 'categories/:category',
        component: CategoryComponent,
      },
      {
        path: 'providers/:provider',
        component: ProviderComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamesRoutingModule {}
