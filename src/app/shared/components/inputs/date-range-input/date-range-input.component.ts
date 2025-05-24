import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-date-range-input',
  standalone: false,
  templateUrl: './date-range-input.component.html',
  styleUrls: ['./date-range-input.component.scss']
})
export class DateRangeInputComponent {
  @Input() fromLabel = 'From Date';
  @Input() toLabel = 'To Date';
  @Input() min = '';
  @Input() max = '';

  @Output() rangeChange = new EventEmitter<{ from: string; to: string }>();

  fromDate = '';
  toDate = '';
  isError = false;
  errorMessage = '';

  onFromChange(date: string) {
    this.fromDate = date;
    this.validateAndEmit();
  }

  onToChange(date: string) {
    this.toDate = date;
    this.validateAndEmit();
  }

  validateAndEmit() {
    this.isError = false;
    this.errorMessage = '';

    if (this.fromDate && this.toDate && this.fromDate > this.toDate) {
      this.isError = true;
      this.errorMessage = 'From Date cannot be after To Date';
      return;
    }

    this.rangeChange.emit({ from: this.fromDate, to: this.toDate });
  }
}
