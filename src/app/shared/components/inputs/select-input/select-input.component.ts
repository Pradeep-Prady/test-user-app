import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
  flag?: string;
  currency?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select-input',
  standalone: false,
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectInputComponent),
      multi: true,
    },
  ],
})
export class SelectInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = 'Select an option';
  @Input() id = '';
  @Input() isError = false;
  @Input() errorMessage = '';
  @Input() disabled = false;
  @Input() options: SelectOption[] = [];
  @Input() containerClass = '';
  @Input() inputContainerClass = '';
  @Input() inputClass = '';
  @Input() hideBracket = false;

  value: any = '';
  isOpen = false;

  onChange: any = () => {};
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

  toggleDropdown(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.onTouched();
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;

    this.value = option.value;
    this.onChange(this.value);
    this.onTouched();
    this.isOpen = false;
  }

  getSelectedLabel(): string {
    if (!this.value && this.value !== 0) return '';

    const selectedOption = this.options.find((o) => o.value === this.value);
    return selectedOption ? selectedOption.label : '';
  }

  onClickOutside(event: Event): void {
    if (!(event.target as HTMLElement).closest('.select-container')) {
      this.closeDropdown();
    }
  }

  getSelectedOption(): SelectOption | undefined {
    return this.options.find((o) => o.value === this.value);
  }
}
