import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { BaseService } from '../../../services/base.service';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  standalone: false,
  styleUrls: ['./provider.component.scss'], // fixed typo from styleUrl
})
export class ProviderComponent implements OnInit {
  constructor(
    private baseService: BaseService,
    private route: ActivatedRoute
  ) {}

  isSearchFocused = false;
  games: any[] = [];
  providerParam = '';
  searchTerm = '';
  page = 0;
  limit = 42;
  totalGames = 0;
  hasMoreData = true;

  clearSearch() {
    this.searchTerm = '';
    this.searchGames();
  }

  searchGames() {
    this.page = 0;
    this.hasMoreData = true;

    this.baseService
      .getAllThirdPartyGames(
        '',
        this.providerParam,
        this.searchTerm,
        this.page,
        this.limit
      )
      .subscribe((res: any) => {
        this.games = res.results.games;
        this.totalGames = res.results.games_length;
        this.hasMoreData = this.games.length < this.totalGames;
      });
  }

  onSearch() {
    this.searchGames();
  }

  loadMore() {
    this.page++;

    this.baseService
      .getAllThirdPartyGames(
        '',
        this.providerParam,
        this.searchTerm,
        this.page,
        this.limit
      )
      .subscribe((res: any) => {
        const newGames = res.results.games;
        this.games = [...this.games, ...newGames];
        this.totalGames = res.results.games_length;
        this.hasMoreData = this.games.length < this.totalGames;
      });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.providerParam = params.get('provider') || '';
      this.page = 0;
      this.hasMoreData = true;
      this.searchTerm = '';

      this.baseService
        .getAllThirdPartyGames(
          '',
          this.providerParam,
          '',
          this.page,
          this.limit
        )
        .subscribe((res: any) => {
          this.games = res.results.games;
          this.totalGames = res.results.games_length;
          this.hasMoreData = this.games.length < this.totalGames;
        });
    });
  }
}
