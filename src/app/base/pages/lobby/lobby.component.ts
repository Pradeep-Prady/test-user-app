import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PromotionalBannerComponent } from '../../partials/components/promotional-banner/promotional-banner.component';

import { CurrencyComponent } from './partials/currency/currency.component';
import { GridCardsComponent } from './partials/grid-cards/grid-cards.component';
import { CategoriesComponent } from './partials/categories/categories.component';
import { RoundWinningsComponent } from './partials/round-winnings/round-winnings.component';
import { CommonModule } from '@angular/common';
// import { ProvidersComponent } from '../providers/providers.component';
import { LobbyService } from './services/lobby.service';
import { Lotto60OriginalsComponent } from './partials/lotto60-originals/lotto60-originals.component';
import { FormsModule } from '@angular/forms';
import { allCategories } from '../../partials/constants';
import { BaseService } from '../../services/base.service';
interface SlotItem {
  id: number;
  title?: string;
  image?: string;
}

@Component({
  selector: 'app-lobby',
  standalone: false,
  // imports: [
  //   CommonModule,
  //   PromotionalBannerComponent,
  //   CurrencyComponent,
  //   GridCardsComponent,

  //   FormsModule,
  //   RoundWinningsComponent,
  //   // ProvidersComponent,
  //   Lotto60OriginalsComponent,
  // ],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss',
})
export class LobbyComponent implements OnInit {
  isSearchFocused: boolean = false;

  liveCasinoItems: SlotItem[] = [
    {
      id: 1,
      image: '/assets/images/lobby/games/liveCasino/infinite_blackjack.png',
    },
    {
      id: 2,
      image: '/assets/images/lobby/games/liveCasino/french_roulette_gold.png',
    },
    {
      id: 3,
      image: '/assets/images/lobby/games/liveCasino/blackjack_vip_8.png',
    },
    { id: 4, image: '/assets/images/lobby/games/liveCasino/vip_roulette.png' },
    {
      id: 5,
      image: '/assets/images/lobby/games/liveCasino/blackjack_vip_7.png',
    },
    {
      id: 6,
      image: '/assets/images/lobby/games/liveCasino/speed_blackjack_a.png',
    },
    {
      id: 7,
      image: '/assets/images/lobby/games/liveCasino/blackjack_vip_beta.png',
    },
    {
      id: 8,
      image: '/assets/images/lobby/games/liveCasino/blackjack_vip_d.png',
    },
  ];

  featuredGames: any[] = [];
  isLobby: boolean = true;

  constructor(
    private lobbyService: LobbyService,
    private baseService: BaseService
  ) {}

  ngOnInit(): void {
    this.lobbyService.getAllFeaturedThirdPartyGames().subscribe((res: any) => {
      this.featuredGames = res.results;
    });

    this.baseService.getAllThirdPartyGamesCategories().subscribe((res: any) => {
      const matchedTitles = res.results.map((name: string) =>
        name.toLowerCase()
      );
      this.categories = allCategories.filter((category) =>
        matchedTitles.includes(category.title.toLowerCase())
      );

      // this.categories.unshift({
      //   title: 'All',
      //   icon: 'fa-solid fa-cubes-stacked',
      //   link: '/categories/all-games',
      // });
    });

    this.searchGames({ category: '' });
  }

  categories: any = [];

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  isScrollLeftDisabled = true;
  isScrollRightDisabled = false;

  ngAfterViewInit() {
    this.checkScrollPosition();
    this.scrollContainer.nativeElement.addEventListener('scroll', () => {
      this.checkScrollPosition();
    });
  }

  checkScrollPosition() {
    const container = this.scrollContainer.nativeElement;
    this.isScrollLeftDisabled = container.scrollLeft <= 0;
    this.isScrollRightDisabled =
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - 10;
  }

  getGridTemplateColumns(): string {
    // Calculate how many items we have for the grid (excluding the first large item)
    const smallItemsCount = Math.max(0, this.categories.length - 1);

    // For a 2-row grid, we need half as many columns (rounded up)
    const columnsNeeded = Math.ceil(smallItemsCount / 2);

    // Return the grid-template-columns style with the appropriate number of columns
    return `repeat(${columnsNeeded}, 220px)`;
  }

  scrollLeft() {
    const container = this.scrollContainer.nativeElement;
    container.scrollBy({ left: -440, behavior: 'smooth' });
  }

  scrollRight() {
    const container = this.scrollContainer.nativeElement;
    container.scrollBy({ left: 440, behavior: 'smooth' });
  }

  searchTerm: string = '';
  searchResultGames: any = {};
  selectedCategory: string = '';

  clearSearch() {
    this.searchTerm = '';
    this.onCategorySelect(this.selectedCategory);
  }

  loadFeaturedGames() {
    this.lobbyService.getAllFeaturedThirdPartyGames().subscribe((res: any) => {
      this.featuredGames = res.results;
    });
  }

  searchGames(params: { game_name?: string; category?: string } = {}) {
    if (params.category) {
      this.selectedCategory = params.category;
    }
    this.lobbyService
      .thirdPartyGamesSearch(this.searchTerm, this.selectedCategory)
      .subscribe({
        next: (d) => {
          this.searchResultGames = d.results;
        },
        error(err) {
          console.log('error', err);
        },
      });
  }

  onSearch() {
    this.searchGames();
  }

  onCategorySelect(category: string) {
    this.selectedCategory = category;
    this.isLobby = false;
    this.searchGames({ category: this.selectedCategory });
  }
}
