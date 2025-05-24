import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { BaseService } from '../../../services/base.service';
import { allCategories } from '../../../partials/constants';

interface Game {
  game_id: string;
  game_name: string;
  thumbnail: string;
  category: string;
  provider_id: string;
  is_active: boolean;
  is_featured: boolean;
  subprovider: string;
  created_at: string;
  updated_at: string;
  other_details: any;
}

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  standalone: false,
})
export class CategoryComponent implements OnInit {
  constructor(
    private baseService: BaseService,
    private route: ActivatedRoute
  ) {}

  isSearchFocused = false;
  totalGames = 0;
  games: Game[] = [];
  categoryParam = '';
  currentCategory: any = {};
  searchTerm = '';
  selectedCategory = '';
  page = 0;
  limit = 42;
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
        this.categoryParam,
        '',
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
        this.categoryParam,
        '',
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
      this.page = 0;
      this.hasMoreData = true;
      this.searchTerm = '';

      this.categoryParam = params.get('category') || '';
      if (this.categoryParam === 'all-games') {
        this.categoryParam = '';
      }

      this.baseService
        .getAllThirdPartyGames(
          this.categoryParam,
          '',
          '',
          this.page,
          this.limit
        )
        .subscribe((res: any) => {
          this.games = res.results.games;
          this.totalGames = res.results.games_length;
          this.hasMoreData = this.games.length < this.totalGames;
        });

      this.currentCategory = allCategories.find(
        (category: any) =>
          category.title.toLowerCase() === this.categoryParam.toLowerCase()
      );

      if (!this.currentCategory) {
        this.currentCategory = {
          title: 'All Games',
          icon: 'fa-solid fa-cubes-stacked',
          link: '/categories/all-games',
        };
      }
    });
  }
}
