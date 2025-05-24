import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-password-input',
  standalone: false,
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
  ],
})
export class PasswordInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() id = '';
  @Input() isError = false;
  @Input() errorMessage = '';
  @Input() disabled = false;
  @Input() isValid = false;

  isViewPassword = false;
  inputType = 'password';
  value: any = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  isFocused: boolean = false;

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

  togglePasswordVisibility() {
    this.isViewPassword = !this.isViewPassword;
    this.inputType = this.isViewPassword ? 'text' : 'password';
  }
}
