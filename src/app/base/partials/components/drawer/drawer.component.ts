import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { allCategories } from '../../constants';
import { BaseService } from '../../../services/base.service';
import { LobbyService } from '../../../pages/lobby/services/lobby.service';
import { AuthHelperService } from '../../../../auth/services/auth-helper.service';

export interface Language {
  name: string;
  key: string;
}

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  standalone: false,
})
export class DrawerComponent implements OnInit {
  @Output() goBack = new EventEmitter<boolean>();
  @Output() foldSideBar = new EventEmitter<boolean>();
  @Input() showFoldSideBar: boolean = false;
  @Input() showMenu: boolean = false;
  @Input() showLanguageSelector: boolean = false;
  @Input() showLoginModal: boolean = false;
  @Input() showSignupModal: boolean = false;
  @Input() showForgotPasswordModal: boolean = false;
  // Add new output event
  @Output() openLanguageModel = new EventEmitter<void>();
  @Output() showLogin = new EventEmitter<void>();
  @Output() showSignup = new EventEmitter<void>();
  @Output() showForgotPassword = new EventEmitter<void>();

  openLanguageSelector() {
    this.openLanguageModel.emit();
  }

  isDrawerFolded: boolean = false;
  showLanguageModel: boolean = false;

  dropdowns = {
    category: 'category',
    language: 'language',
  };

  selectedDropdown = '';
  categories: any[] = [];
  lottoOriginalGames: any[] = [];

  constructor(
    public router: Router,
    private lobbyService: LobbyService,
    private baseService: BaseService,
    private authHelper: AuthHelperService
  ) {
    if (this.isLoggedIn) {
      // Fetch user data if not available
    }
  }
  currentLanguage!: Language;
  isLoggedIn = false;

  ngOnInit(): void {
    this.authHelper.language$.subscribe((lang) => {
      this.currentLanguage = lang;
    });

    this.lobbyService.getAllLotto60OriginalsGames().subscribe((res: any) => {
      this.lottoOriginalGames = res.result;
    });

    this.baseService.getAllThirdPartyGamesCategories().subscribe((res: any) => {
      const matchedTitles = res.results.map((name: string) =>
        name.toLowerCase()
      );
      this.categories = allCategories.filter((category) =>
        matchedTitles.includes(category.title.toLowerCase())
      );

      this.categories.unshift({
        title: 'All Games',
        icon: 'fa-solid fa-cubes-stacked',
        link: '/categories/all-games',
      });
    });
  }

  handleDropdown(type: string) {
    if (this.selectedDropdown == type) {
      this.selectedDropdown = '';
      return;
    }
    this.selectedDropdown = type;
  }

  closeDrawer() {
    this.goBack.emit();
  }

  foldDrawer(fold: boolean) {
    this.isDrawerFolded = fold;
    this.foldSideBar.emit(this.isDrawerFolded);
  }

  showForgotPasswordPage() {
    this.showLoginModal = false;
    this.showSignupModal = false;
    this.showForgotPasswordModal = true;
  }

  showLoginPage() {
    this.showSignupModal = false;
    this.showForgotPasswordModal = false;
    this.showLoginModal = true;
  }
}
