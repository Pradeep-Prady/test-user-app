import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { allCategories } from '../../../../partials/constants';

import { BaseService } from '../../../../services/base.service';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  @Input() selectedCategory: string = '';
  @Output() categorySelected = new EventEmitter<string>();
  constructor(private baseService: BaseService) {}

  categories: any = [];

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  isScrollLeftDisabled = true;
  isScrollRightDisabled = false;

  ngAfterViewInit() {
    this.checkScrollPosition();
    this.scrollContainer.nativeElement.addEventListener('scroll', () => {
      this.checkScrollPosition();
    });
  }

  scrollLeft() {
    const container = this.scrollContainer.nativeElement;
    container.scrollBy({ left: -440, behavior: 'smooth' });
  }

  scrollRight() {
    const container = this.scrollContainer.nativeElement;
    container.scrollBy({ left: 440, behavior: 'smooth' });
  }

  checkScrollPosition() {
    const container = this.scrollContainer.nativeElement;
    this.isScrollLeftDisabled = container.scrollLeft <= 0;
    this.isScrollRightDisabled =
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - 10;
  }

  getGridTemplateColumns(): string {
    // Calculate how many items we have for the grid (excluding the first large item)
    const smallItemsCount = Math.max(0, this.categories.length - 1);

    // For a 2-row grid, we need half as many columns (rounded up)
    const columnsNeeded = Math.ceil(smallItemsCount / 2);

    // Return the grid-template-columns style with the appropriate number of columns
    return `repeat(${columnsNeeded}, 220px)`;
  }

  ngOnInit(): void {
    this.baseService.getAllThirdPartyGamesCategories().subscribe((res: any) => {
      const matchedTitles = res.results.map((name: string) =>
        name.toLowerCase()
      );
      this.categories = allCategories.filter((category) =>
        matchedTitles.includes(category.title.toLowerCase())
      );
    });
  }
}
