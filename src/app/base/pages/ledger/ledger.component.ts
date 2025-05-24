import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  AuthHelperService,
  Balance,
} from '../../../auth/services/auth-helper.service';
import { BaseService } from '../../services/base.service';
import { NormalSelectComponent } from '../../../shared/components/inputs/normal-select/normal-select.component';
import { ProfileService } from '../profile/services/profile.service';

@Component({
  selector: 'app-ledger',
  standalone: false,
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss'],
})
export class LedgerComponent implements OnInit, OnDestroy {
  // balance: Balance = {
  //   balance: 0,
  //   currency_symbol: 'USD',
  //   currency_name: 'USD',
  // };

  balance: number = 0;

  ledgerData: any[] = [];
  isLoading: boolean = false;

  @Input() closeDropdownEvent = new EventEmitter<void>();

  @ViewChild('typeSelect') typeSelectRef!: NormalSelectComponent;
  @ViewChild('periodSelect') periodSelectRef!: NormalSelectComponent;

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  selectedTypeOption: string = 'all';
  selectedPeriodOption: string = '24h';
  customFromDate: string = '';
  customToDate: string = '';

  types = [
    { label: 'All Type', value: 'all' },
    { label: 'Deposit', value: 'deposit' },
    { label: 'Withdraw', value: 'withdraw' },
    { label: 'Games', value: 'games' },
  ];

  periods = [
    { label: 'Past 24 hours', value: '24h' },
    { label: 'Past 7 days', value: '7d' },
    { label: 'Past 30 days', value: '30d' },
    { label: 'Past 60 days', value: '60d' },
    { label: 'Custom Date', value: 'custom' },
  ];

  private subscription: Subscription = new Subscription();

  constructor(
    private baseService: BaseService,
    private authHelper: AuthHelperService,
    private profileService: ProfileService
  ) {}

  today: any;
  user: any;

  sort_ledger_by: string = '';
  sort_ledger_by_desc: Boolean = false;

  sortValues(value: string) {
    this.sort_ledger_by = value;
    this.sort_ledger_by_desc = !this.sort_ledger_by_desc;

    this.fetchLedgerData();
  }

  getTodayDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0]; // Format: yyyy-MM-dd
  }

  ngOnInit() {
    this.subscription.add(
      this.authHelper.balance$.subscribe((balance) => {
        this.balance = balance.balance;
      })
    );

    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.user = res.result;
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.today = this.getTodayDate(); // <-- Add this

    this.fetchLedgerData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onTypeOptionSelected(option: any) {
    this.selectedTypeOption = option.value;
    this.currentPage = 1;
    // this.fetchLedgerData();
  }

  onPeriodOptionSelected(option: any) {
    this.selectedPeriodOption = option.value;
    this.currentPage = 1;
    // this.fetchLedgerData();
  }

  onCustomDateRangeChange(range: { from: string; to: string }) {
    this.customFromDate = range.from;
    this.customToDate = range.to;
  }

  fetchLedgerData() {
    this.isLoading = true;
    const now = new Date();
    let from: string;
    let to: string = now.toISOString();

    switch (this.selectedPeriodOption) {
      case '24h':
        from = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        break;
      case '7d':
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case '30d':
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case '60d':
        from = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case 'custom':
        from = this.customFromDate;
        to = this.customToDate;
        break;
      default:
        from = '2023-01-01T00:00:00';
    }

    const type =
      this.selectedTypeOption === 'all' ? '' : this.selectedTypeOption;
    const page = (this.currentPage - 1).toString();
    const limit = this.itemsPerPage.toString();

    this.baseService
      .getLedgers(
        from,
        to,
        type,
        this.sort_ledger_by,
        this.sort_ledger_by_desc,
        page,
        limit
      )
      .subscribe({
        next: (response: any) => {
          this.ledgerData = response.result.ledger_activities;
          this.totalItems = response.result.length;
          this.isLoading = false;
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Error fetching ledger data:', error);
        },
      });
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.fetchLedgerData();
  }

  applyFilters() {
    this.currentPage = 1;
    this.fetchLedgerData();
    this.typeSelectRef.closeDropdown();
    this.periodSelectRef.closeDropdown();
  }

  resetFilters() {
    this.selectedTypeOption = 'all';
    this.selectedPeriodOption = '24h';
    this.customFromDate = '';
    this.customToDate = '';
    this.currentPage = 1;
    this.fetchLedgerData();
    this.typeSelectRef.closeDropdown();
    this.periodSelectRef.closeDropdown();
  }

  get totalPages(): number[] {
    const total = Math.ceil(this.totalItems / this.itemsPerPage);
    return Array.from({ length: total }, (_, i) => i + 1);
  }
}
