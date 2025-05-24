import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  authReq: any;
  count = 0;

  constructor(private router: Router, private cookieService: CookieService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.count++;

    this.authReq = request.clone({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.cookieService.get(environment.token)}`,
      }),
    });

    if (this.authReq.url.includes('/upload')) {
      this.authReq = request.clone({
        headers: new HttpHeaders({}),
      });
    }

    return next.handle(this.authReq).pipe(
      tap({
        next: (e) => {
          if (e instanceof HttpResponse) {
            this.count--;
            if (this.count === 0) {
              this.count = 0;
            }
          }
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            this.count--;
            if (this.count === 0) {
              this.count = 0;
            }
            if (error.status === 401) {
              this.router.navigateByUrl('/auth/login');
            }
          }
        },
      })
    );
  }
}
