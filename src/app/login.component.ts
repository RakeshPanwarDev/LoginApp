import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnDestroy {
  email = signal('');
  password = signal('');
  error = signal('');
  private destroy$ = new Subject<void>();

  constructor(private auth: AuthService, private router: Router) {}

  loginLocal() {
    this.error.set('');
    this.auth.loginLocal(this.email(), this.password())
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error.set('Wrong credentials (local)');
        }
      });
  }

  loginApi() {
    this.error.set('');
    this.auth.loginApi(this.email(), this.password())
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error.set('Wrong credentials (api)');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
