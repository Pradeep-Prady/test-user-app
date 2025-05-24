import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  HostListener,
  OnInit,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-grid-cards',
  standalone: false,
  templateUrl: './grid-cards.component.html',
  styleUrl: './grid-cards.component.scss',
})
export class GridCardsComponent implements AfterViewInit, OnInit {
  @Input() items: any[] = [];
  @Input() title: string = '';

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  isScrollLeftDisabled = true;
  isScrollRightDisabled = false;
  cardWidth = 150;
  largeCardWidth = 300;
  scrollAmount = 440;
  isMobileView = false;

  isBrowser: boolean;

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.updateResponsiveValues();
      this.checkIfMobile();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (!this.isBrowser) return;

    this.updateResponsiveValues();
    this.checkScrollPosition();
    this.checkIfMobile();
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;

    this.checkIfMobile();

    setTimeout(() => {
      if (!this.scrollContainer?.nativeElement) return;

      this.checkScrollPosition();

      const observer = new MutationObserver(() => {
        this.checkScrollPosition();
        this.cdr.detectChanges();
      });

      observer.observe(this.scrollContainer.nativeElement, {
        childList: true,
        subtree: true,
      });

      this.scrollContainer.nativeElement.addEventListener('scroll', () => {
        this.checkScrollPosition();
        this.cdr.detectChanges();
      });
    });
  }

  checkIfMobile() {
    if (this.isBrowser) {
      this.isMobileView = window.innerWidth < 768;
    }
  }

  updateResponsiveValues() {
    if (!this.isBrowser) return;

    const viewportWidth = window.innerWidth;

    if (viewportWidth < 640) {
      this.cardWidth = 130;
      this.largeCardWidth = 220;
      this.scrollAmount = 320;
    } else if (viewportWidth < 768) {
      this.cardWidth = 150;
      this.largeCardWidth = 250;
      this.scrollAmount = 360;
    } else if (viewportWidth < 1024) {
      this.cardWidth = 200;
      this.largeCardWidth = 300;
      this.scrollAmount = 400;
    } else {
      this.cardWidth = 150;
      this.largeCardWidth = 300;
      this.scrollAmount = 440;
    }
  }

  scrollLeft() {
    if (!this.isBrowser) return;

    const container = this.scrollContainer.nativeElement;
    container.scrollBy({ left: -this.scrollAmount, behavior: 'smooth' });
  }

  scrollRight() {
    if (!this.isBrowser) return;

    const container = this.scrollContainer.nativeElement;
    container.scrollBy({ left: this.scrollAmount, behavior: 'smooth' });
  }

  checkScrollPosition() {
    if (!this.isBrowser || !this.scrollContainer?.nativeElement) return;

    const container = this.scrollContainer.nativeElement;
    this.isScrollLeftDisabled = container.scrollLeft <= 0;
    this.isScrollRightDisabled =
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - 10;
  }

  getGridTemplateColumns(): string {
    const itemsCount = this.isMobileView
      ? this.items.length
      : Math.max(0, this.items.length - 1);
    const columnsNeeded = Math.ceil(itemsCount / 2);
    return `repeat(${columnsNeeded}, ${this.cardWidth}px)`;
  }

  getLargeCardStyle() {
    return {
      width: `${this.largeCardWidth}px`,
      height: '100%',
    };
  }

  getSmallCardsItems() {
    return this.isMobileView ? this.items : this.items.slice(1);
  }

  shouldShowLargeCard() {
    return !this.isMobileView && this.items.length > 0;
  }
}
