import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../../config';

@Injectable({
  providedIn: 'root',
})
export class LobbyService {
  constructor(private appConfig: ConfigService, private http: HttpClient) {}

  getAllFeaturedThirdPartyGames(): Observable<any> {
    return this.http.get(this.appConfig.featuredThirdPartyGamesAPI);
  }

  getAllLotto60OriginalsGames(): Observable<any> {
    return this.http.get(this.appConfig.lotto60OriginalsGamesAPI);
  }

  thirdPartyGamesSearch(
    game_name?: string,
    category?: string
  ): Observable<any> {
    let d = this.http.post(this.appConfig.getThirdPartyGamesSearchAPI, {
      game_name,
      category,
    });
    return d;
  }
}
