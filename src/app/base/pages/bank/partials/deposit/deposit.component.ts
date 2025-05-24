import { Component } from '@angular/core';

@Component({
  selector: 'app-deposit',
  standalone: false,
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss'],
})
export class DepositComponent {
  isLoading: boolean = false;
  activeTab: string = 'crypto';

  constructor() {}
}
