import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../../config';
import { ApplicationRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  constructor(
    private appConfig: ConfigService,
    private http: HttpClient,
    private ngZone: NgZone,
    private appRef: ApplicationRef
  ) {}

  getBalance(): Observable<any> {
    // Create a new Observable that will be executed outside Angular's zone
    return new Observable((observer) => {
      this.ngZone.runOutsideAngular(() => {
        this.http.get(this.appConfig.getBalanceAPI).subscribe({
          next: (response) => {
            // Notify Angular that the application state has changed
            this.ngZone.run(() => {
              observer.next(response);
              observer.complete();
              // Manually trigger change detection
              this.appRef.tick();
            });
          },
          error: (error) => {
            this.ngZone.run(() => {
              observer.error(error);
            });
          },
        });
      });
    });
  }

  getLedgers(
    from_date: string,
    to_date: string,
    type: string,
    sort_ledger_by: string,
    sort_ledger_by_desc: Boolean,
    page: string = '0',
    limit: string = '10'
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    const body: any = {
      from_date,
      to_date,
      type: type === '' ? null : type,
    };

    // Only include sorting if sort_ledger_by is not empty
    if (sort_ledger_by !== '') {
      body.sort_ledger_by = sort_ledger_by;
      body.sort_ledger_by_desc = sort_ledger_by_desc;
    }

    return this.http.post(this.appConfig.getLedgerAPI, body, { params });
  }

  getAllThirdPartyGamesCategories(): Observable<any> {
    // Create a new Observable that will be executed outside Angular's zone
    return new Observable((observer) => {
      this.ngZone.runOutsideAngular(() => {
        this.http
          .get(this.appConfig.getAllThirdPartyGamesCategoriesAPI)
          .subscribe({
            next: (response) => {
              // Notify Angular that the application state has changed
              this.ngZone.run(() => {
                observer.next(response);
                observer.complete();
              });
            },
            error: (error) => {
              this.ngZone.run(() => {
                observer.error(error);
              });
            },
          });
      });
    });
  }

  getAllThirdPartyGames(
    category?: string,
    aggregated_from_provider?: string,
    game_name?: string,
    page: number = 0,
    limit: number = 42
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    // Create a new Observable that will be executed outside Angular's zone
    return new Observable((observer) => {
      this.ngZone.runOutsideAngular(() => {
        this.http
          .post(
            this.appConfig.getThirdPartyGamesSearchAPI,
            {
              category,
              aggregated_from_provider,
              game_name,
            },
            {
              params,
            }
          )
          .subscribe({
            next: (response) => {
              // Notify Angular that the application state has changed
              this.ngZone.run(() => {
                observer.next(response);
                observer.complete();
              });
            },
            error: (error) => {
              this.ngZone.run(() => {
                observer.error(error);
              });
            },
          });
      });
    });
  }
}
