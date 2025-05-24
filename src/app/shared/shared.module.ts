import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordInputComponent } from './components/inputs/password-input/password-input.component';
import { TextInputComponent } from './components/inputs/text-input/text-input.component';
import { UsernameInputComponent } from './components/inputs/username-input/username-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateInputComponent } from './components/inputs/date-input/date-input.component';
import { SelectInputComponent } from './components/inputs/select-input/select-input.component';
import { InputComponent } from './components/inputs/input/input.component';
import { OtpInputComponent } from './components/inputs/otp-input/otp-input.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { LocaleCurrencyPipe } from './pipes/locale-currency/locale-currency.pipe';
import { LoadingComponent } from './components/loading/loading.component';
import { NormalSelectComponent } from './components/inputs/normal-select/normal-select.component';
import { DateRangeInputComponent } from './components/inputs/date-range-input/date-range-input.component';
 
@NgModule({
  declarations: [
    PasswordInputComponent,
    TextInputComponent,
    UsernameInputComponent,
    DateInputComponent,
    SelectInputComponent,
    InputComponent,
    OtpInputComponent,
    LocaleCurrencyPipe,
    NormalSelectComponent,
    LoadingComponent,
    DateRangeInputComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgOtpInputModule,
 
  ],
  exports: [
    PasswordInputComponent,
    TextInputComponent,
    UsernameInputComponent,
    DateInputComponent,
    SelectInputComponent,
    InputComponent,
    OtpInputComponent,
    LocaleCurrencyPipe,
    LoadingComponent,
    NormalSelectComponent,
    DateRangeInputComponent,

  ],
})
export class SharedModule {}
