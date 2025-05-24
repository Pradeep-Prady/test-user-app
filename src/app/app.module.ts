import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Appconfig } from './app.config';
import { HttpClientModule } from '@angular/common/http';
import { NointernetComponent } from './partials/nointernet/nointernet.component';
import { PagenotfoundComponent } from './partials/pagenotfound/pagenotfound.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [AppComponent, NointernetComponent, PagenotfoundComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastComponent,
  ],
  providers: [Appconfig, HttpClientModule, CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
