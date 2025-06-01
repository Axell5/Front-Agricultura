import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent]
})
export class LoginComponent implements OnInit {
  loading = false;
  returnUrl: string = '/dashboard';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    // Si ya está autenticado, redirigir
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onLogin(): void {
    this.loading = true;
    
    this.authService.login().subscribe({
      next: () => {
        this.notificationService.showSuccess('Login successful');
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.notificationService.showError('Login failed');
        this.loading = false;
        console.error('Login error:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}