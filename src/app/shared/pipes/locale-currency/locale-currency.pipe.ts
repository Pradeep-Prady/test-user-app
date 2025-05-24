// import { Pipe, PipeTransform } from '@angular/core';
// import { AuthHelperService } from '../../../auth/services/auth-helper.service';

// @Pipe({
//   name: 'localeCurrency',
//   standalone: false,
//   pure: false,
// })
// export class LocaleCurrencyPipe implements PipeTransform {
//   private currentLanguageKey = 'en'; // Default fallback

//   // Map language key to both locale and currency code
//   private localeCurrencyMap: Record<
//     string,
//     { locale: string; currency: string }
//   > = {
//     en: { locale: 'en-US', currency: 'USD' },
//     pt: { locale: 'pt-PT', currency: 'EUR' },
//     bn: { locale: 'bn-BD', currency: 'BDT' },
//     vi: { locale: 'vi-VN', currency: 'VND' },
//     fil: { locale: 'fil-PH', currency: 'PHP' },
//   };

//   constructor(private authHelper: AuthHelperService) {
//     this.authHelper.language$.subscribe((lang) => {
//       this.currentLanguageKey = lang.key || 'en';
//     });
//   }

//   transform(currencyInfo: { balance: number }): string {
//     const config =
//       this.localeCurrencyMap[this.currentLanguageKey] ||
//       this.localeCurrencyMap['en'];
//     const { locale, currency } = config;
//     const { balance } = currencyInfo;

//     // ✅ Truncate to 2 decimal places without rounding
//     const truncatedBalance = Math.floor(balance * 100) / 100;

//     // ✅ Format with separators only, using Latin digits
//     const formatter = new Intl.NumberFormat(locale, {
//       style: 'currency',
//       currency,
//       currencyDisplay: 'symbol', // ensures it gives $ not USD
//       useGrouping: true,
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//       numberingSystem: 'latn',
//     });

//     // Get the currency symbol
//     const parts = formatter.formatToParts(truncatedBalance);
//     const symbolPart = parts.find((p) => p.type === 'currency');
//     const formattedNumber = formatter.format(truncatedBalance);

//     // Remove symbol from formatted and manually combine it
//     const numberWithoutSymbol = formattedNumber
//       .replace(symbolPart?.value || '', '')
//       .trim();

//     return `${currency} ${symbolPart?.value || ''} ${numberWithoutSymbol}`;
//   }
// }

import { Pipe, PipeTransform } from '@angular/core';
import { AuthHelperService } from '../../../auth/services/auth-helper.service';

@Pipe({
  name: 'localeCurrency',
  standalone: false,
  pure: false,
})
export class LocaleCurrencyPipe implements PipeTransform {
  private preferredCurrency = 'USD'; // Default
  private currencySymbol = '$';
  private locale = 'en-US'; // Default fallback

  private currencyLocaleMap: Record<string, string> = {
    USD: 'en-US',
    EUR: 'pt-PT',
    BDT: 'bn-BD',
    VND: 'vi-VN',
    PHP: 'fil-PH',
  };

  constructor(private authHelper: AuthHelperService) {
    this.authHelper.user$.subscribe((user) => {
      if (user?.preferred_currency) {
        this.preferredCurrency = user.preferred_currency;
        this.currencySymbol =
          user.currency_symbol ||
          this.getSymbolFromCurrency(user.preferred_currency);
        this.locale =
          this.currencyLocaleMap[user.preferred_currency] || 'en-US';
      }
    });
  }

  // transform(currencyInfo: { balance: number }): string {
  transform(balance: number) {
    // const { balance } = currencyInfo;

    const truncatedBalance = Math.floor(balance * 100) / 100;

    const formatter = new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency: this.preferredCurrency,
      currencyDisplay: 'symbol',
      useGrouping: true,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      numberingSystem: 'latn',
    });

    const parts = formatter.formatToParts(truncatedBalance);
    const symbolPart = parts.find((p) => p.type === 'currency');
    const formattedNumber = formatter.format(truncatedBalance);

    const numberWithoutSymbol = formattedNumber
      .replace(symbolPart?.value || '', '')
      .trim();

    return `${this.preferredCurrency} ${
      symbolPart?.value || this.currencySymbol
    } ${numberWithoutSymbol}`;
  }

  private getSymbolFromCurrency(currency: string): string {
    try {
      const formatter = new Intl.NumberFormat('en', {
        style: 'currency',
        currency,
        currencyDisplay: 'symbol',
      });
      const parts = formatter.formatToParts(0);
      return parts.find((p) => p.type === 'currency')?.value || '';
    } catch {
      return '';
    }
  }
}
