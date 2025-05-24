import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: false,
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() page: number = 1;
  @Input() totalPages: number = 1; // Should be the number, not array
  @Output() pageChange = new EventEmitter<number>();

displayPages(): (number | string)[] {
  const total = this.totalPages;
  const current = this.page;
  const pages: (number | string)[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (current <= 4) {
      pages.push(2, 3, 4);
      pages.push('...');
    } else if (current >= total - 3) {
      pages.push('...');
      pages.push(total - 3, total - 2, total - 1);
    } else {
      pages.push('...');
      pages.push(current - 1, current, current + 1);
      pages.push('...');
    }

    pages.push(total);
  }

  return pages;
}


  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.pageChange.emit(this.page);
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.pageChange.emit(this.page);
    }
  }

  goToPage(p: any) {
    if (p !== this.page) {
      this.page = p;
      this.pageChange.emit(p);
    }
  }
}
