import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationComponent]
})
export class HeaderComponent {
  isMenuOpen = false;

  constructor(public authService: AuthService) { }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
  }
}