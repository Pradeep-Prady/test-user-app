import { Component, EventEmitter, Output } from '@angular/core';
import { AuthHelperService } from '../../../../auth/services/auth-helper.service';
interface Language {
  name: string;
  key: string;
}

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.scss'],
  standalone: false,
})
export class LanguageSelectComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() showLanguageSelector = new EventEmitter<void>();
  @Output() languageSelected = new EventEmitter<string>();

  close() {
    this.closeModal.emit();
  }

  constructor(private authHelper: AuthHelperService) {
    this.selectedLanguage = this.authHelper.getLanguage();
  }

  searchTerm: string = '';
  isSearchFocused: boolean = false;
  selectedLanguage: Language = { name: 'English', key: 'en' };

  clearSearch() {
    this.searchTerm = '';
  }

  onSearch() {}

  languages: Language[] = [
    { name: 'English', key: 'en' },
    { name: 'Portuguese', key: 'pt' },
    { name: 'Bangla', key: 'bn' },
    { name: 'Vietnamese', key: 'vi' },
    { name: 'Filipino', key: 'fil' },
  ];

  selectLanguage(lang: Language) {
    this.selectedLanguage = lang;
    this.authHelper.setLanguage(lang); // pass full object
    this.languageSelected.emit(lang.key); // or emit full `lang` if needed
    this.closeModal.emit();
  }

  get filteredLanguages(): Language[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.languages;
    return this.languages.filter((lang) =>
      lang.name.toLowerCase().includes(term)
    );
  }
}
