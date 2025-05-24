import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastConfig {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  showIcon?: boolean;
}

@Injectable({
  providedIn: 'root',
})

export class ToastService {
  private toastSubject = new BehaviorSubject<ToastConfig | null>(null);
  toast$: Observable<ToastConfig | null> = this.toastSubject.asObservable();

  // Track active toast timeout
  private activeTimeout: any = null;

  constructor() {}

  show(config: ToastConfig) {
    // Clear any existing timeout
    if (this.activeTimeout) {
      clearTimeout(this.activeTimeout);
    }

    const defaultConfig: ToastConfig = {
      duration: 2000,
      showIcon: true,
      ...config,
    };

    this.toastSubject.next(defaultConfig);

    if (defaultConfig.duration && defaultConfig.duration > 0) {
      this.activeTimeout = setTimeout(() => {
        this.hide();
        this.activeTimeout = null;
      }, defaultConfig.duration);
    }
  }

  hide() {
    this.toastSubject.next(null);
    if (this.activeTimeout) {
      clearTimeout(this.activeTimeout);
      this.activeTimeout = null;
    }
  }

  success(message: string, duration?: number) {
    this.show({ message, type: 'success', duration });
  }

  error(message: string, duration?: number) {
    this.show({ message, type: 'error', duration });
  }

  warning(message: string, duration?: number) {
    this.show({ message, type: 'warning', duration });
  }

  info(message: string, duration?: number) {
    this.show({ message, type: 'info', duration });
  }
}
