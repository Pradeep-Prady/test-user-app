import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nointernet',
  templateUrl: './nointernet.component.html',
  styleUrls: ['./nointernet.component.scss'],
})
export class NointernetComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.retry();
  }

  retry() {
    if (navigator.onLine) {
      this.router.navigateByUrl('/dashboard');
    } else {
      this.router.navigateByUrl('/no-internet');
    }
  }
}
