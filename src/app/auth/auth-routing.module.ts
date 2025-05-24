import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { NonAuthGuard } from './guards/non-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [NonAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
