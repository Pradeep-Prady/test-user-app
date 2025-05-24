import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ConfigService } from '../../config';
import { AuthHelperService } from './auth-helper.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private appConfig: ConfigService,
    private http: HttpClient,
    private authHelper: AuthHelperService
  ) {}

  getCurrencies(): Observable<any> {
    return this.http.get(this.appConfig.getCurrenciesAPI);
  }

  signUp(data: any): Observable<any> {
    return this.http.post(this.appConfig.signupAPI, {
      email: data.email,
      username: data.username,
      password: data.password,
      firstname: data.firstName,
      lastname: data.lastName,
      dob: data.dob,
      preferred_currency: data.preferred_currency,
    });
  }

  login(data: any): Observable<any> {
    return this.http
      .post(this.appConfig.loginAPI, {
        email_or_username: data.email_or_username,
        password: data.password,
        otp: data.otp!,
      })
      .pipe(
        tap((response: any) => {
          if (response && response.token) {
            this.authHelper.setToken(response.token);
          }
        })
      );
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(this.appConfig.forgotPasswordAPI, {
      email: data.email,
    });
  }

  resetPassword(data: any): Observable<any> {
    return this.http.put(this.appConfig.resetPasswordAPI, {
      password: data.password,
      secret: data.token,
    });
  }

  sendEmailVerification(data: any): Observable<any> {
    return this.http.post(this.appConfig.verifyEmailAPI, {
      email_or_username: data.email,
      password: data.password,
    });
  }

  verifyEmailToken(token: string): Observable<any> {
    return this.http.put(this.appConfig.verifyEmailTokenAPI, {
      secret: token,
    });
  }

  verifyTFA(data: any): Observable<any> {
    return this.http.post(this.appConfig.profileVerifyTFAAPI, {
      tfa_type: data.tfa_type,
      secret: data.secret,
      otp: data.otp,
    });
  }

  usernameCheck(data: any): Observable<any> {
    return this.http.post(this.appConfig.usernameCheckAPI, {
      username: data.username,
    });
  }

  logout(): void {
    this.authHelper.logout();
  }
}
