import {
  Component,
  Input,
  forwardRef,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-input',
  standalone: false,
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true,
    },
  ],
})
export class DateInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() id = '';
  @Input() isError = false;
  @Input() errorMessage = '';
  @Input() disabled = false;
  @Input() min = ''; // Minimum date
  @Input() max = ''; // Maximum date
  @Input() isGradientBorder = true;
  @Output() dateChange = new EventEmitter<string>();

  
  @Input() containerClass = ''; // For the outer container
  @Input() inputContainerClass = ''; // For the div with gradient border
  @Input() inputClass = ''; // For the input element itself
  
  
  @ViewChild('datepicker') datepicker!: ElementRef;

  openDatePicker() {
    this.datepicker.nativeElement.showPicker();
  }

  value: any = '';

  onChange: any = (value: any) => {
    // Clear error message when date changes
    if (value) {
      this.isError = false;
      this.errorMessage = '';
    }
    this.dateChange.emit(value);
  };

  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
