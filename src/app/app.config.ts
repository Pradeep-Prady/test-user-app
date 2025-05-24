import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from './config';
import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { BaseModule } from './base/base.module';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    CookieService,
    ConfigService,
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    importProvidersFrom(BaseModule),
    provideAnimations(),
  ],
};
