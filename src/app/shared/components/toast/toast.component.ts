 

import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, Renderer2 } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { ToastService, ToastConfig } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  animations: [
    trigger('toastAnimation', [
      state(
        'void',
        style({
          transform: 'translateX(100%)',
          opacity: 0,
        })
      ),
      state(
        'visible',
        style({
          transform: 'translateX(0)',
          opacity: 1,
        })
      ),
      transition('void => visible', [animate('200ms ease-out')]),
      transition('visible => void', [animate('200ms ease-in')]),
    ]),
  ],
})
export class ToastComponent implements OnInit, OnDestroy {
  toast: ToastConfig | null = null;
  animationState = 'void';
  private subscription: Subscription | null = null;
  private bodyScrollState: string | null = null;

  constructor(
    private toastService: ToastService,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Apply global scrollbar fix
      this.preventScrollbarFlash();
    }

    this.subscription = this.toastService.toast$.subscribe((toast) => {
      if (toast) {
        // Start with void state
        this.animationState = 'void';

        // Apply toast with slight delay for animation
        setTimeout(() => {
          this.toast = toast;
          this.animationState = 'visible';
          
          // Prevent scrollbar on showing toast
          if (isPlatformBrowser(this.platformId)) {
            this.hideScrollbars();
          }
        }, 10);
        
        // Auto-hide toast after specified duration if appropriate
        // if (toast.autoHide !== false) {
        //   const duration = toast.duration || 3000;
        //   setTimeout(() => {
        //     this.closeToast();
        //   }, duration);
        // }
      } else {
        // Handle toast dismissal
        this.animationState = 'void';

        // Remove toast after animation completes
        setTimeout(() => {
          this.toast = null;
          // Restore scrollbars when toast is hidden
          if (isPlatformBrowser(this.platformId)) {
            this.restoreScrollbars();
          }
        }, 200);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    
    // Restore scrollbars when component is destroyed
    if (isPlatformBrowser(this.platformId)) {
      this.restoreScrollbars();
    }
  }
  
  /**
   * Prevents scrollbar flash during animations by applying classes to the document
   */
  private preventScrollbarFlash(): void {
    // Add a style element to hide scrollbars globally
    const styleElem = this.renderer.createElement('style');
    styleElem.id = 'toast-scrollbar-fix';
    styleElem.innerHTML = `
      .toast-showing {
        overflow: hidden !important;
      }
      
      .toast-showing * {
        -ms-overflow-style: none !important;
        scrollbar-width: none !important;
      }
      
      .toast-showing *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
    `;
    this.renderer.appendChild(document.head, styleElem);
  }
  
  /**
   * Hides scrollbars when toast is visible
   */
  private hideScrollbars(): void {
    // Store original overflow state
    if (document.body && !this.bodyScrollState) {
      this.bodyScrollState = window.getComputedStyle(document.body).overflow;
      this.renderer.addClass(document.body, 'toast-showing');
    }
  }
  
  /**
   * Restores scrollbars when toast is hidden
   */
  private restoreScrollbars(): void {
    if (document.body) {
      this.renderer.removeClass(document.body, 'toast-showing');
    }
  }

  closeToast() {
    this.toastService.hide();
  }
}