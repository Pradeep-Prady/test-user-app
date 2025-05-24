import { Component, OnInit } from '@angular/core';
import { BankService } from '../../../services/bank.service';

@Component({
  selector: 'app-fiat',
  standalone: false,

  templateUrl: './fiat.component.html',
  styleUrls: ['./fiat.component.scss'],
})
export class FiatComponent implements OnInit {
  activePaymentMethod: string = '';
  currentPage: string = 'choose-method';
  isStatusPage: boolean = false;
  amount: number = 0;

  amoutError: string = '';
  paymentMethodsError: string = '';
  constructor(private bankService: BankService) {}

  paymentMethods: any[] = [];

  ngOnInit() {
    this.bankService.getFiatPaymentMethods().subscribe({
      next: (res) => {
        this.paymentMethods = res.result;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  deposit() {
    // Reset error messages
    this.amoutError = '';
    this.paymentMethodsError = '';

    // Step 1: Validate if payment method is selected
    if (!this.activePaymentMethod) {
      this.paymentMethodsError = 'Please select a payment method';
      return;
    }

    // Step 2: Find the selected payment method
    const selectedCurrency = this.paymentMethods.find((currency: any) =>
      currency.payment_methods.some(
        (method: any) => method.id === this.activePaymentMethod
      )
    );

    if (!selectedCurrency) {
      this.paymentMethodsError = 'Selected payment method is invalid';
      return;
    }

    const payment_method = selectedCurrency.payment_methods.find(
      (method: any) => method.id === this.activePaymentMethod
    );

    if (!payment_method) {
      this.paymentMethodsError = 'Selected payment method is invalid';
      return;
    }

    // Step 3: Validate amount
    if (!this.amount || this.amount <= 0) {
      this.amoutError = 'Please enter a valid amount';
      return;
    }

    if (this.amount < payment_method.min_amount) {
      this.amoutError = `Amount must be at least ${payment_method.min_amount}`;
      return;
    }

    if (this.amount > payment_method.max_amount) {
      this.amoutError = `Amount must not exceed ${payment_method.max_amount}`;
      return;
    }

    // ✅ All validations passed — proceed to deposit
    console.log('Proceeding with deposit:', {
      method: payment_method.name,
      amount: this.amount,
    });

    this.currentPage = 'fiat-pay';

    // this.isLoading = true;
    // this.bankService.deposit(payment_method.id, this.amount).subscribe({
    //   next: (res) => {
    //     this.isLoading = false;
    //     console.log('Deposit successful:', res);
    //     // TODO: handle success (e.g., redirect or notify)
    //   },
    //   error: (err) => {
    //     this.isLoading = false;
    //     console.log('Deposit failed:', err);
    //     // TODO: handle error display
    //   },
    // });
  }
}
