import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-normal-select',
  standalone: false,
  templateUrl: './normal-select.component.html',
  styleUrls: ['./normal-select.component.scss'],
})
export class NormalSelectComponent implements OnInit {
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = 'Select Option';
  @Input() defaultValue: string = 'all';

  // @Output() closeDropdownEvent = new EventEmitter<void>();

  private _value: string = '';

  @Input()
  set value(val: string) {
    this._value = val;
    this.setSelectedOptionByValue(val);
  }
  get value(): string {
    return this._value;
  }

  closeDropdown(): void {
    console.log('try closeing')
    this.isDropdownOpen = false;
  }

  @Output() selectionChange = new EventEmitter<SelectOption>();

  isDropdownOpen: boolean = false;
  selectedOption: SelectOption | null = null;
  filteredOptions: SelectOption[] = [];

  ngOnInit(): void {
    if (this._value) {
      this.setSelectedOptionByValue(this._value);
    } else {
      const defaultOption = this.options.find(
        (opt) => opt.value === this.defaultValue
      );
      if (defaultOption) {
        this.selectedOption = defaultOption;
      }
    }

    this.filteredOptions = [...this.options];
  }

  setSelectedOptionByValue(val: string): void {
    const matchedOption = this.options.find(opt => opt.value === val);
    if (matchedOption) {
      this.selectedOption = matchedOption;
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.filteredOptions = [...this.options];
      setTimeout(() => {
        const searchInput = document.querySelector(
          '.search-input'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 0);
    }
  }

  selectOption(option: SelectOption): void {
    this.selectedOption = option;
    this._value = option.value;
    this.selectionChange.emit(option);
    this.isDropdownOpen = false;
  }

  clearSearch(): void {
    const searchInput = document.querySelector(
      '.search-input'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }

  onClickOutside(event: Event): void {
    if (
      this.isDropdownOpen &&
      !(event.target as HTMLElement).closest('.select-container')
    ) {
      this.isDropdownOpen = false;
    }
  }

  isOptionSelected(option: SelectOption): boolean {
    return this.selectedOption?.value === option.value;
  }
}
