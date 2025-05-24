import { Component, OnInit } from '@angular/core'; 

interface Currency {
  name: string;
  icon: string;
  active: boolean;
}

@Component({
  selector: 'app-currency',
  standalone: false,
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.scss',
})

export class CurrencyComponent{
  currencies: Currency[] =  [
    {
      icon: 'assets/images/lobby/currencies/btc.svg',
      name: 'btc',
      active: false,
    },
    {
      icon: '/assets/images/lobby/currencies/avax.svg',
      name: 'avax',
      active: false,

      
    },
    {
      icon: '/assets/images/lobby/currencies/bch.svg',
      name: 'bch',
      active: false,

    },
    {
      icon: '/assets/images/lobby/currencies/bnb.svg',
      name: 'bnb',
      active: false,

    },
    {
      icon: '/assets/images/lobby/currencies/dash.svg',
      name: 'dash',
      active: false,

    },
    {
      icon: '/assets/images/lobby/currencies/doge.svg',
      name: 'doge',
      active: false,

    },
    {
      icon: '/assets/images/lobby/currencies/ltc.svg',
      name: 'ltc',
      active: false,

    },
    {
      icon: '/assets/images/lobby/currencies/link.svg',
      name: 'link',
      active: false,

    },
    {
      icon: '/assets/images/lobby/currencies/trx.svg',
      name: 'trx',
      active: false,

    },
    {
      icon: '/assets/images/lobby/currencies/eth.svg',
      name: 'eth',
      active: false,

    },
    {
      icon: '/assets/images/lobby/currencies/usdt.svg',
      name: 'usdt',
      active: false,

    },
  ];

   constructor() {}


  toggleCurrency(currency: Currency): void {
    // Desktop behavior can use hover
    if (window.matchMedia('(hover: hover)').matches) {
      return;
    }
    
    // Mobile behavior uses active state
    this.currencies.forEach(c => {
      // Deactivate all others
      if (c !== currency) {
        c.active = false;
      }
    });
    
    // Toggle the clicked currency
    currency.active = !currency.active;
  }

  handleTouchStart(currency: Currency, event: TouchEvent): void {
    // For mobile, we need to manually handle touch events
    if (!window.matchMedia('(hover: hover)').matches) {
      event.preventDefault();
      this.toggleCurrency(currency);
    }
  }
}
