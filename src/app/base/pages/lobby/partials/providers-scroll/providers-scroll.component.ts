import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { providers } from '../../../../partials/constants';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
@Component({
  selector: 'app-providers-scroll',
  templateUrl: './providers-scroll.component.html',
  styleUrl: './providers-scroll.component.scss',
  standalone: false,
})
export class ProvidersScrollComponent implements AfterViewInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  providers: any[] = providers;

  cardWidth = 250;
  gapWidth = 8;
  isAtStart = true;
  isAtEnd = false;
  showNavigation = true;
  showProviders: boolean = false;
  
  isSearchFocused: boolean = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
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

        this.scrollContainer.nativeElement.addEventListener('scroll', () => {
          this.checkScrollPosition();
        });

        this.checkScrollPosition();
      }
    }
  }

  // Scroll left function
  scrollLeft() {
    if (this.scrollContainer && this.scrollContainer.nativeElement) {
      const container = this.scrollContainer.nativeElement;
      const scrollAmount = this.cardWidth + this.gapWidth;
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    }
  }

  // Scroll right function
  scrollRight() {
    if (this.scrollContainer && this.scrollContainer.nativeElement) {
      const container = this.scrollContainer.nativeElement;
      const scrollAmount = this.cardWidth + this.gapWidth;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
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
