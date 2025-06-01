import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AnalyticsComponent {
  analytics = {
    cropYield: {
      current: 85,
      previous: 75,
      trend: 'up'
    },
    waterUsage: {
      current: 65,
      previous: 80,
      trend: 'down'
    },
    soilHealth: {
      current: 90,
      previous: 85,
      trend: 'up'
    },
    pestControl: {
      current: 95,
      previous: 70,
      trend: 'up'
    }
  };
}