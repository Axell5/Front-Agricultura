import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationComponent]
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isLoggedIn = false;
  username: string = '';

  constructor(
    public authService: AuthService,
    private keycloakService: KeycloakService
  ) { }

  async ngOnInit() {
    this.isLoggedIn = await this.keycloakService.isLoggedIn();
    if (this.isLoggedIn) {
      const userProfile = await this.keycloakService.loadUserProfile();
      this.username = userProfile.username || '';
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  async logout(): Promise<void> {
    try {
      await this.keycloakService.logout(window.location.origin);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}