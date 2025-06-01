import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sensor-card',
  templateUrl: './sensor-card.component.html',
  styleUrls: ['./sensor-card.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SensorCardComponent {
  @Input() sensor: any;
  
  getStatusClass(): string {
    switch (this.sensor.status) {
      case 'critical': return 'status-critical';
      case 'warning': return 'status-warning';
      default: return 'status-normal';
    }
  }
  
  getStatusText(): string {
    switch (this.sensor.status) {
      case 'critical': return 'Critical';
      case 'warning': return 'Warning';
      default: return 'Normal';
    }
  }
  
  getSensorIcon(): string {
    switch (this.sensor.type) {
      case 'moisture': return '💧';
      case 'temperature': return '🌡️';
      case 'pH': return '🧪';
      case 'humidity': return '💦';
      case 'light': return '☀️';
      default: return '📊';
    }
  }
  
  getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  }
}