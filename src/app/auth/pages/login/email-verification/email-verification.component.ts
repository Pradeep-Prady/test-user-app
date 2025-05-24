import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-email-verification',
  standalone: false,
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.scss',
})
export class EmailVerificationComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  @Output() showLoginModal = new EventEmitter<void>();

  isLinkExpired: boolean = false;
  close() {
    this.closeModal.emit();
  }
  token: string = '';
  constructor(private route: ActivatedRoute, private authService: AuthService) {
    this.route.params.subscribe((params) => {
      this.token = params['token'];
    });
  }
  backToHome() {
    this.closeModal.emit();
    this.showLoginModal.emit();
  }

  verifyEmailToken() {
    this.authService.verifyEmailToken(this.token).subscribe((res) => {
      if (res.status === true) {
        this.isLinkExpired = false;
      } else {
        this.isLinkExpired = true;
      }
    });
  }

  ngOnInit() {
    this.verifyEmailToken();
  }
}
