import { Injectable } from '@angular/core';
import { ConfigService } from '../../../../config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  constructor(private appConfig: ConfigService, private http: HttpClient) {}

  getFiatPaymentMethods(): Observable<any> {
    return this.http.get(this.appConfig.fetchFiatPaymentMethodsAPI);
  }

  getCryptoPaymentMethods(): Observable<any> {
    return this.http.get(this.appConfig.fetchCryptoPaymentMethodsAPI);
  }
}
