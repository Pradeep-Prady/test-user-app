import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  NgZone,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { register } from 'swiper/element/bundle';

interface PromotionalSlide {
  image: string;
}

@Component({
  selector: 'app-promotional-banner',
  templateUrl: './promotional-banner.component.html',
  styleUrls: ['./promotional-banner.component.scss'],
  standalone: false,
})
export class PromotionalBannerComponent implements AfterViewInit {
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;
  @ViewChildren('bulletIndicator') bulletIndicators!: QueryList<ElementRef>;

  slides: PromotionalSlide[] = [
    { image: '/assets/images/lobby/banners/banner1.png' },
    { image: '/assets/images/lobby/banners/banner1.png' },
    { image: '/assets/images/lobby/banners/banner1.png' },
  ];

  activeIndex = 0;

  constructor(private cdr: ChangeDetectorRef, private zone: NgZone) {
    register();
  }

  ngAfterViewInit(): void {
    // Use setTimeout to ensure the swiper element is fully initialized
    setTimeout(() => {
      this.initializeSwiper();
    }, 0);
  }

  initializeSwiper(): void {
    const swiperEl = this.swiperContainer?.nativeElement;
    if (!swiperEl) {
      return;
    }

    // Swiper parameters
    const swiperParams = {
      slidesPerView: 1,
      pagination: false,
      autoplay: {
        delay: 1000,
        disableOnInteraction: true,
      },
      loop: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: false,
      },
      speed: 800,
      observer: true,
      observeParents: true,
      resizeObserver: true,
    };

    // Assign parameters to swiper element
    Object.assign(swiperEl, swiperParams);

    // Add all event listeners
    this.setupEventListeners(swiperEl);

    // Initialize swiper
    swiperEl.initialize();
  }

  setupEventListeners(swiperEl: any): void {
    // Add event listeners for all swiper events that should update the UI
    const events = [
      'slidechange',
      'afterinit',
      'progress',
      'touchend',
      'transitionend',
    ];

    events.forEach((eventName) => {
      swiperEl.addEventListener(eventName, (event: any) => {
        this.zone.run(() => {
          if (event.detail && event.detail[0]) {
            // Use activeIndex instead of realIndex for better tracking
            this.activeIndex = event.detail[0].activeIndex;
            this.cdr.detectChanges();
            console.log(`${eventName} event - Active index:`, this.activeIndex);
          }
        });
      });
    });
  }

  goToSlide(index: number): void {
    const swiperEl = this.swiperContainer?.nativeElement;
    if (swiperEl?.swiper) {
      swiperEl.swiper.slideToLoop(index);
      // Force active state synchronization
      this.activeIndex = index;
      this.cdr.detectChanges();
    } else {
      console.warn('Swiper not initialized yet');
    }
  }
}
