import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  user: any = null;

  constructor(private auth: AuthService) {
    this.user = this.auth.getCurrentUser();
  }

  logout() {
    this.auth.logout();
  }
}
