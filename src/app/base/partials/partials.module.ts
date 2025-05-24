import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerComponent } from './components/drawer/drawer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LanguageSelectComponent } from './components/language-select/language-select.component';
import { PromotionalBannerComponent } from './components/promotional-banner/promotional-banner.component';
import { NoresultsComponent } from './components/noresults/noresults.component';
import { AuthModule } from '../../auth/auth.module';
import { SharedModule } from '../../shared/shared.module';
import { PaginationComponent } from './components/pagination/pagination.component';

@NgModule({
  declarations: [
    DrawerComponent,
    HeaderComponent,
    FooterComponent,
    LanguageSelectComponent,
    PromotionalBannerComponent,
    NoresultsComponent,
    PaginationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AuthModule,
    SharedModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    DrawerComponent,
    LanguageSelectComponent,
    PromotionalBannerComponent,
    NoresultsComponent,
    PaginationComponent,

  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PartialsModule {}
