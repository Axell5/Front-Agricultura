import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { IoTDashboardComponent } from './features/iot/iot-dashboard/iot-dashboard.component';
import { MarketplaceComponent } from './features/marketplace/marketplace.component';
import { MessagingComponent } from './features/messaging/messaging.component';
import { RewardsComponent } from './features/rewards/rewards.component';
import { AnalyticsComponent } from './features/analytics/analytics.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'iot', component: IoTDashboardComponent, canActivate: [AuthGuard] },
  { path: 'marketplace', component: MarketplaceComponent, canActivate: [AuthGuard] },
  { path: 'messaging', component: MessagingComponent, canActivate: [AuthGuard] },
  { path: 'rewards', component: RewardsComponent, canActivate: [AuthGuard] },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGuard] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }