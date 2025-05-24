import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private loginModalSubject = new BehaviorSubject<boolean>(false);
  loginModal$ = this.loginModalSubject.asObservable();

  constructor() {}

  showLoginModal() {
    this.loginModalSubject.next(true);
  }

  hideLoginModal() {
    this.loginModalSubject.next(false);
  }
}