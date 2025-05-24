import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AuthHelperService } from '../../../../auth/services/auth-helper.service';
export interface Language {
  name: string;
  key: string;
}

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  showLanguageDropdown = false;
  @Input() showLanguageSelector: boolean = false;

  constructor(private authHelper: AuthHelperService) {}
  currentLanguage!: Language;

  ngOnInit() {
    this.authHelper.language$.subscribe((lang) => {
      this.currentLanguage = lang;
    });
  }

  toggleLanguageDropdown() {
    this.showLanguageDropdown = !this.showLanguageDropdown;
  }

  showLanguageModel() {
    this.showLanguageSelector = true;
    // this.drawer(false);
  }
}
