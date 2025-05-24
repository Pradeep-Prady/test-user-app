import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PartialsModule } from '../../partials.module';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, PartialsModule],
  templateUrl: './mobile-nav.component.html',
  styleUrl: './mobile-nav.component.scss',
})
export class MobileNavComponent {
  @Output() goBack = new EventEmitter<boolean>();
  @Output() foldSideBar = new EventEmitter<boolean>();
  @Input() showFoldSideBar: boolean = false;
  @Output() openLanguageModel = new EventEmitter<void>();
  @Input() showLanguageSelector: boolean = false;

  isDrawerFolded: boolean = false;
  showMenu: boolean = false;
  showDrawer = false;

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  foldDrawer(fold: boolean) {
    this.isDrawerFolded = fold;
    this.foldSideBar.emit(this.isDrawerFolded);
  }

  drawer(show: boolean) {
    if (!show) {
      // First trigger the closing animation by updating a class
      const drawerElement = document.querySelector(
        '.w-full.h-full'
      ) as HTMLElement;
      if (drawerElement) {
        drawerElement.classList.remove('open-left-modal-transition');
        drawerElement.classList.add('close-left-modal-transition');
      }
      // Then hide the drawer after animation completes
      setTimeout(() => {
        this.showDrawer = show;
      }, 100);
    } else {
      this.showDrawer = show;
    }
  }

  showLanguageModel() {
    this.showLanguageSelector = true;
    this.drawer(false);
  }
}
