import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ConfigService } from '../../../../config';
import { AuthHelperService } from '../../../../auth/services/auth-helper.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  access_token: any;
  constructor(
    private appConfig: ConfigService,
    private http: HttpClient,
    // private cookieService: CookieService,
    private authHelper: AuthHelperService
  ) {
    this.access_token = this.authHelper.getToken();

    // this.cookieService.get(environment.token);
  }

  //get the cookies

  getProfile(): Observable<any> {
    return this.http.get(this.appConfig.getProfileAPI);
  }

  updateProfile(
    firstname: string,
    lastname: string,
    dob: string
  ): Observable<any> {
    return this.http.put(this.appConfig.updateProfileAPI, {
      firstname,
      lastname,
      dob,
    });
  }

  changePassword(
    old_password: string,
    new_password: string,
    otp?: string
  ): Observable<any> {
    return this.http.put(this.appConfig.changePasswordAPI, {
      old_password,
      new_password,
      otp,
    });
  }

  generateTFA(tfa_type: string): Observable<any> {
    return this.http.post(this.appConfig.get2FAQRAPI, {
      tfa_type,
    });
  }

  enableTFA(tfa_type: string, secret: string, otp: string): Observable<any> {
    return this.http.post(this.appConfig.profileVerifyTFAAPI, {
      tfa_type,
      secret,
      otp,
    });
  }

  verifyTFA(tfa_type: string, otp: string): Observable<any> {
    return this.http.post(this.appConfig.verifyTFAAPI, {
      tfa_type,
      otp,
    });
  }

  disableTFA(): Observable<any> {
    return this.http.delete(this.appConfig.disableTFAAPI);
  }

  createKYCVerification(
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    gender: string
  ): Observable<any> {
    return this.http.post(this.appConfig.createKYCAPI, {
      firstName,
      lastName,
      dateOfBirth,
      gender,
    });
  }
}
