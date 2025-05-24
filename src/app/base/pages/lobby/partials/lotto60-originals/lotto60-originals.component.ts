import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { LobbyService } from '../../services/lobby.service';

@Component({
  selector: 'app-lotto60-originals',
  standalone: false,
  templateUrl: './lotto60-originals.component.html',
  styleUrl: './lotto60-originals.component.scss',
})
export class Lotto60OriginalsComponent implements AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  lottoOriginalGames: any[] = [];
  cardWidth = 250;
  gapWidth = 8; // Gap between cards in pixels
  isAtStart = true;
  isAtEnd = false;
  showNavigation = false;

  constructor(
    private lobbyService: LobbyService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.lobbyService.getAllLotto60OriginalsGames().subscribe((res: any) => {
      this.lottoOriginalGames = res.result;
      // After data loads, we check scroll position and update nav visibility
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          this.checkScrollPosition();
          this.updateNavigationVisibility();
        });
      }
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.scrollContainer?.nativeElement) {
        const firstCard =
          this.scrollContainer.nativeElement.querySelector('.card-item');
        if (firstCard) {
          const computedStyle = window.getComputedStyle(firstCard);
          this.cardWidth =
            firstCard.offsetWidth +
            parseInt(computedStyle.marginLeft || '0') +
            parseInt(computedStyle.marginRight || '0');
        }
        this.checkScrollPosition();
        this.updateNavigationVisibility();
      }
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScrollPosition();
      this.updateNavigationVisibility();
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScrollPosition();
    }
  }

  private updateNavigationVisibility() {
    if (
      this.scrollContainer &&
      this.scrollContainer.nativeElement &&
      isPlatformBrowser(this.platformId)
    ) {
      const container = this.scrollContainer.nativeElement;
      this.showNavigation =
        this.lottoOriginalGames.length > 5 &&
        container.scrollWidth > container.clientWidth;
    }
  }

  private checkScrollPosition() {
    if (
      this.scrollContainer &&
      this.scrollContainer.nativeElement &&
      isPlatformBrowser(this.platformId)
    ) {
      const container = this.scrollContainer.nativeElement;
      this.isAtStart = container.scrollLeft <= 0;
      this.isAtEnd =
        container.scrollLeft + container.clientWidth >= container.scrollWidth;
    }
  }

  scrollLeft() {
    if (
      this.scrollContainer &&
      this.scrollContainer.nativeElement &&
      isPlatformBrowser(this.platformId)
    ) {
      const scrollAmount = (this.cardWidth + this.gapWidth) * 2;
      this.scrollContainer.nativeElement.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(() => this.checkScrollPosition(), 500);
    }
  }

  scrollRight() {
    if (
      this.scrollContainer &&
      this.scrollContainer.nativeElement &&
      isPlatformBrowser(this.platformId)
    ) {
      const scrollAmount = (this.cardWidth + this.gapWidth) * 2;
      this.scrollContainer.nativeElement.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(() => this.checkScrollPosition(), 500);
    }
  }
}
