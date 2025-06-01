import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { EventService } from '../../core/services/event.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, CardComponent]
})
export class DashboardComponent implements OnInit {
  weatherData = {
    temperature: 24,
    humidity: 65,
    rainfall: 12,
    forecast: 'Partly Cloudy'
  };
  
  sensorAlerts = [
    { id: 1, type: 'Moisture', status: 'Low', location: 'Field A', time: '10:30 AM' },
    { id: 2, type: 'Temperature', status: 'High', location: 'Greenhouse 2', time: '11:45 AM' },
    { id: 3, type: 'pH Level', status: 'Optimal', location: 'Field B', time: '12:15 PM' }
  ];
  
  recentActivities = [
    { id: 1, action: 'Purchase', details: 'Fertilizer (50kg)', time: '09:15 AM' },
    { id: 2, action: 'Message', details: 'From: Agricultural Expert', time: '11:30 AM' },
    { id: 3, action: 'System', details: 'Irrigation scheduled', time: '01:45 PM' }
  ];

  constructor(
    private eventService: EventService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.eventService.events$.subscribe(event => {
      this.handleEvent(event);
    });
    
    setTimeout(() => {
      this.eventService.simulateEvent('iot', { 
        type: 'HumedadBaja', 
        value: 25, 
        location: 'Field C' 
      });
    }, 5000);
  }

  handleEvent(event: any): void {
    switch (event.type) {
      case 'iot':
        this.notificationService.showWarning(`IoT Alert: ${event.payload.type} detected in ${event.payload.location}`);
        this.sensorAlerts.unshift({
          id: this.sensorAlerts.length + 1,
          type: 'Moisture',
          status: 'Critical',
          location: event.payload.location,
          time: this.formatTime(new Date())
        });
        if (this.sensorAlerts.length > 5) {
          this.sensorAlerts.pop();
        }
        break;
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}