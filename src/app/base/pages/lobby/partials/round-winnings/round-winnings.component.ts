import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface WinningData {
  game: string;
  player: string;
  betAmount: number;
  multiplier: number;
  profit: number;
  icon?: string; // Using ? to make it optional
}

interface CurrencyData {
  icon: string;
  name: string;
}

@Component({
  selector: 'app-round-winnings',
  standalone: false,
  templateUrl: './round-winnings.component.html',
  styleUrl: './round-winnings.component.scss',
})
export class RoundWinningsComponent {
  activeTab: string = 'lotto60Originals';
  allGames: WinningData[] = [
    {
      game: 'Money Mania',
      player: 'Charlie',
      betAmount: 1000,
      multiplier: 1.8,
      profit: 1800,
      icon: 'fa-solid fa-cubes-stacked',
    },
    {
      game: 'Slots',
      player: 'David',
      betAmount: 750,
      multiplier: 3.0,
      profit: 2250,
      icon: 'fa-solid fa-slot-machine',
    },
    {
      game: 'Power Ball',
      player: 'Frank',
      betAmount: 250,
      multiplier: 2.0,
      profit: 500,
      icon: 'fa-solid fa-cubes-stacked',
    },
  ];
  lotto60Originals: WinningData[] = [
    {
      game: 'Lotto 60 Originals',
      player: 'Andrews',
      betAmount: 500,
      multiplier: 2.5,
      profit: 1250,
      icon: '/assets/images/logos/60RedWhite.svg',
    },
    {
      game: 'Lotto 60 Originals',
      player: 'Emma',
      betAmount: 300,
      multiplier: 4.0,
      profit: 1200,
      icon: '/assets/images/logos/60RedWhite.svg',
    },
  ];

  get data(): WinningData[] {
    return this.activeTab === 'lotto60Originals'
      ? this.lotto60Originals
      : this.allGames;
  }

  currencies: CurrencyData[] = [
    {
      icon: '../../../../../assets/images/currencies/btc.svg',
      name: 'btc',
    },
    {
      icon: '../../../../../assets/images/currencies/avax.svg',
      name: 'avax',
    },
    {
      icon: '../../../../../assets/images/currencies/bch.svg',
      name: 'bch',
    },
    {
      icon: '../../../../../assets/images/currencies/bnb.svg',
      name: 'bnb',
    },
    {
      icon: '../../../../../assets/images/currencies/dash.svg',
      name: 'dash',
    },
    {
      icon: '../../../../../assets/images/currencies/doge.svg',
      name: 'doge',
    },
    {
      icon: '../../../../../assets/images/currencies/ltc.svg',
      name: 'ltc',
    },
    {
      icon: '../../../../../assets/images/currencies/link.svg',
      name: 'link',
    },
    {
      icon: '../../../../../assets/images/currencies/trx.svg',
      name: 'trx',
    },
    {
      icon: '../../../../../assets/images/currencies/eth.svg',
      name: 'eth',
    },
    {
      icon: '../../../../../assets/images/currencies/usdt.svg',
      name: 'usdt',
    },
  ];

  changeActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
