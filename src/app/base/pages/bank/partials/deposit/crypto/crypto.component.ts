import { Component, OnInit } from '@angular/core';
import { BankService } from '../../../services/bank.service';

@Component({
  selector: 'app-crypto',
  standalone: false,
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss'],
})
export class CryptoComponent implements OnInit {
  constructor(private bankService: BankService) {}

  paymentMethods: any[] = [];
  activePaymentMethod: string = '';
  activeNetwork: string = '';
  amount: string = '';
  currentPage = 'choose-method';
  // currentPage = 'crypto-pay';

  amoutError: string = '';
  paymentMethodsError: string = '';
  isLoading: boolean = false;
  networkError: string = '';
  isStatusPage: boolean = false;
  paymentOptions: any = [];
  networkOptions: any = [];


  get numericAmount(): number {
  return parseFloat(this.amount || '0');
}

  onPaymentMethodChange(selectedKey: string) {
    this.activeNetwork = '';

    const selectedCurrency = this.paymentMethods.find(
      (item) => item.currency_key === selectedKey
    );

    if (selectedCurrency) {
      const method = selectedCurrency.payment_methods[0]; // Assuming one payment method per currency

      const min = method.min_amount;
      const max = method.max_amount;

      // If min and max are equal, set that value directly
      if (min === max) {
        this.amount = min;
      }

      console.log(selectedCurrency, 'selectedCurrency');
      // Reset network options if needed
      this.networkOptions = selectedCurrency.payment_methods.map(
        (method: any) => {
          return {
            value: method.id,
            label: method.name,
          };
        }
      );
      // Optional: Store limits for validation
      this.amoutError = '';
    }
  }

  ngOnInit() {
    this.bankService.getCryptoPaymentMethods().subscribe({
      next: (res) => {
        let data = {
          status: true,
          message: 'Payment method for deposit loaded successfully.',
          result: [
            {
              currency_id: '4d58d0f9-5804-4931-bef5-df26e28e1ca1',
              currency_name: 'ETH',
              currency_key: 'ETH',
              one_by_one: false,
              symbol: 'ETH',
              payment_methods: [
                {
                  id: '7b1abaa6-5d0d-454e-ba60-655a85effb55',
                  name: 'ETH',
                  logo: 'https://banners-and-assets.s3.us-east-1.amazonaws.com/misc/ETH.svg',
                  details: {},
                  max_amount: 100000.0,
                  min_amount: 50.0,
                },
              ],
            },
            {
              currency_id: '4aa53fe5-2d8f-4fca-9cd3-5902ff92f439',
              currency_name: 'DASH',
              currency_key: 'DASH',
              one_by_one: true,
              symbol: 'DASH',
              payment_methods: [
                {
                  id: 'e714cea2-3b26-40ba-9afe-3327ebffd006',
                  name: 'DASH',
                  logo: 'https://banners-and-assets.s3.us-east-1.amazonaws.com/misc/DASH.svg',
                  details: {},
                  max_amount: 100000.0,
                  min_amount: 50.0,
                },
              ],
            },
            {
              currency_id: '7d595917-0427-4733-95d4-1dc13870ced3',
              currency_name: 'DOGE',
              currency_key: 'DOGE',
              one_by_one: false,
              symbol: 'DOGE',
              payment_methods: [
                {
                  id: '7d476142-e9e0-415e-a7e1-8830a0e3191c',
                  name: 'DOGE',
                  logo: 'https://banners-and-assets.s3.us-east-1.amazonaws.com/misc/DOGE.svg',
                  details: {},
                  max_amount: 50.0,
                  min_amount: 50.0,
                },
              ],
            },
            {
              currency_id: '6acacaa8-aef4-473c-b4a3-2771b0bd9fb9',
              currency_name: 'TRX',
              currency_key: 'TRX',
              one_by_one: false,
              symbol: 'TRX',
              payment_methods: [
                {
                  id: '1b2fdcf6-bc4f-4718-abf4-e9b9d84d2c60',
                  name: 'TRX',
                  logo: 'https://banners-and-assets.s3.us-east-1.amazonaws.com/misc/TRX.svg',
                  details: {},
                  max_amount: 100000.0,
                  min_amount: 50.0,
                },
              ],
            },
            {
              currency_id: 'a7137e60-d8fb-421b-ac00-f64552ab7c71',
              currency_name: 'BCH',
              currency_key: 'BCH',
              one_by_one: false,
              symbol: 'BCH',
              payment_methods: [
                {
                  id: '7ddca70f-7b36-4fd9-ba4c-c1d8f9b7e899',
                  name: 'BCH',
                  logo: 'https://banners-and-assets.s3.us-east-1.amazonaws.com/misc/BCH.svg',
                  details: {},
                  max_amount: 100000.0,
                  min_amount: 5.0,
                },
              ],
            },
            {
              currency_id: '83774e38-7b27-4274-b4e7-540256c0a9fb',
              currency_name: 'BNB',
              currency_key: 'BNB',
              one_by_one: false,
              symbol: 'BNB',
              payment_methods: [
                {
                  id: '74abfde5-15af-49d3-bb63-dcda3bf57100',
                  name: 'BNB',
                  logo: 'https://banners-and-assets.s3.us-east-1.amazonaws.com/misc/BNB.svg',
                  details: {},
                  max_amount: 1000000.0,
                  min_amount: 0.0,
                },
              ],
            },
            {
              currency_id: '48d45971-c1a6-42f9-9790-e61751f78ef4',
              currency_name: 'AVAX',
              currency_key: 'AVAX',
              one_by_one: false,
              symbol: 'AVAX',
              payment_methods: [
                {
                  id: '37c12071-88f7-4bb0-afcc-be38fd3ae6f9',
                  name: 'AVAX',
                  logo: 'https://banners-and-assets.s3.us-east-1.amazonaws.com/misc/AVAX.svg',
                  details: {},
                  max_amount: 10000.0,
                  min_amount: 50.0,
                },
              ],
            },
            {
              currency_id: '664f47b0-151d-48df-a541-bf8140c0a880',
              currency_name: 'LTC',
              currency_key: 'LTC',
              one_by_one: false,
              symbol: 'LTC',
              payment_methods: [
                {
                  id: '1fdb364c-176b-4982-b448-b3cc4925f24b',
                  name: 'LTC',
                  logo: 'https://banners-and-assets.s3.us-east-1.amazonaws.com/misc/LTC.svg',
                  details: {},
                  max_amount: 0.2,
                  min_amount: 0.2,
                },
              ],
            },
            {
              currency_id: 'ab8478e0-38a2-49a8-90cf-d5ed2d73e593',
              currency_name: 'BTC',
              currency_key: 'BTC',
              one_by_one: false,
              symbol: 'BTC',
              payment_methods: [
                {
                  id: '2a6c2558-c288-4841-a18e-f79196c154d2',
                  name: 'BTC',
                  logo: 'https://banners-and-assets.s3.us-east-1.amazonaws.com/misc/BTC.svg',
                  details: {},
                  max_amount: 0.0005,
                  min_amount: 0.0005,
                },
              ],
            },
          ],
        };
        // this.paymentMethods = res.result;
        this.paymentMethods = data.result;
        this.paymentOptions = this.paymentMethods.map((method: any) => {
          return {
            value: method.currency_key,
            label: method.currency_name,
            flag: method.payment_methods[0]?.logo || '', // added optional chaining for safety
          };
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

deposit() {
  const selected = this.paymentMethods.find(
    (item) => item.currency_key === this.activePaymentMethod
  );

  if (!selected) {
    this.paymentMethodsError = 'Please select a valid currency.';
    return;
  }

  const method = selected.payment_methods.find(
    (m: any) => m.id === this.activeNetwork
  );

  if (!method) {
    this.networkError = 'Please select a valid network.';
    return;
  }

  if (!this.amount || isNaN(parseFloat(this.amount))) {
    this.amoutError = 'Please enter a valid number.';
    return;
  }

  const numericAmount = parseFloat(this.amount);
  const min = method.min_amount;
  const max = method.max_amount;

  if (numericAmount < min || numericAmount > max) {
    this.amoutError = `Amount must be between ${min} and ${max}`;
    return;
  }

  // Reset errors if all validations pass
  this.amoutError = '';
  this.paymentMethodsError = '';
  this.networkError = '';

  console.log('Depositing', numericAmount, 'to', method.name);
}

}
