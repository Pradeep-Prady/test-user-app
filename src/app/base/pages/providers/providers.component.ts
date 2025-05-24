import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { providers } from '../../partials/constants';

@Component({
  selector: 'app-providers',
  standalone: false,
  templateUrl: './providers.component.html',
  styleUrl: './providers.component.scss',
})
export class ProvidersComponent implements AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  providersResults: any[] = providers;

  cardWidth = 250;
  gapWidth = 8;
  isAtStart = true;
  isAtEnd = false;
  showNavigation = true;
  showProviders: boolean = false;

  searchTerm: string = '';
  isSearchFocused: boolean = false;
  clearSearch() {
    this.searchTerm = '';
    this.providersResults = providers;
  }

  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.providersResults = providers;
      return;
    }
    this.providersResults = providers.filter((provider) =>
      provider.toLowerCase().includes(term)
    );
  }

  ngAfterViewInit() {
    // Optional: You can dynamically calculate card width here if needed
    if (this.scrollContainer && this.scrollContainer.nativeElement) {
      const firstCard =
        this.scrollContainer.nativeElement.querySelector('.card-item');
      if (firstCard) {
        const computedStyle = window.getComputedStyle(firstCard);
        this.cardWidth =
          firstCard.offsetWidth +
          parseInt(computedStyle.marginLeft || '0') +
          parseInt(computedStyle.marginRight || '0');
      }

      // Add event listener for scroll
      this.scrollContainer.nativeElement.addEventListener('scroll', () => {
        this.checkScrollPosition();
      });

      // Initial check
      this.checkScrollPosition();
    }
  }

  close() {
    this.searchTerm = '';
    this.showProviders = false;
    this.providersResults = providers;
  }

  // check scroll position
  private checkScrollPosition() {
    if (this.scrollContainer && this.scrollContainer.nativeElement) {
      const container = this.scrollContainer.nativeElement;
      this.isAtStart = container.scrollLeft <= 0;
      this.isAtEnd =
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 5; // Added small buffer
    }
  }
}
