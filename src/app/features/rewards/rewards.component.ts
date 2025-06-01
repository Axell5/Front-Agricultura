import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class RewardsComponent {
  rewards = [
    {
      id: 1,
      title: 'Early Bird',
      description: 'Get 10% off on your next purchase',
      progress: 80,
      target: 100,
      icon: '🌅'
    },
    {
      id: 2,
      title: 'Loyal Farmer',
      description: 'Unlock premium features',
      progress: 45,
      target: 200,
      icon: '🌾'
    },
    {
      id: 3,
      title: 'Green Thumb',
      description: 'Special access to expert consultations',
      progress: 150,
      target: 300,
      icon: '🌱'
    }
  ];
}