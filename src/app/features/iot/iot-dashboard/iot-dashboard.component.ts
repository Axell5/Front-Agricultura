import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { EventService } from '../../../core/services/event.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SensorCardComponent } from '../sensor-card/sensor-card.component';

interface Sensor {
  id: string;
  name: string;
  type: string;
  location: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: Date;
  history: {time: Date, value: number}[];
}

@Component({
  selector: 'app-iot-dashboard',
  templateUrl: './iot-dashboard.component.html',
  styleUrls: ['./iot-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, ButtonComponent, SensorCardComponent]
})
export class IoTDashboardComponent implements OnInit {
  sensors: Sensor[] = [
    {
      id: '001',
      name: 'Soil Moisture Sensor 1',
      type: 'moisture',
      location: 'Field A - North',
      value: 45,
      unit: '%',
      status: 'normal',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 5),
      history: this.generateHistory(40, 60)
    },
    {
      id: '002',
      name: 'Temperature Sensor 1',
      type: 'temperature',
      location: 'Greenhouse 1',
      value: 28,
      unit: '°C',
      status: 'warning',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 10),
      history: this.generateHistory(24, 30)
    },
    {
      id: '003',
      name: 'pH Sensor 1',
      type: 'pH',
      location: 'Field B - East',
      value: 6.8,
      unit: 'pH',
      status: 'normal',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 15),
      history: this.generateHistory(6.5, 7.2)
    },
    {
      id: '004',
      name: 'Humidity Sensor 1',
      type: 'humidity',
      location: 'Greenhouse 2',
      value: 78,
      unit: '%',
      status: 'normal',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 8),
      history: this.generateHistory(70, 85)
    },
    {
      id: '005',
      name: 'Light Sensor 1',
      type: 'light',
      location: 'Field C - South',
      value: 850,
      unit: 'lux',
      status: 'normal',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 3),
      history: this.generateHistory(700, 1000)
    },
    {
      id: '006',
      name: 'Soil Moisture Sensor 2',
      type: 'moisture',
      location: 'Field C - Central',
      value: 22,
      unit: '%',
      status: 'critical',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 2),
      history: this.generateHistory(20, 30)
    }
  ];

  constructor(
    private eventService: EventService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Subscribe to IoT events
    this.eventService.events$.subscribe(event => {
      if (event.type === 'iot') {
        this.handleIoTEvent(event.payload);
      }
    });
    
    // Simulate sensor updates
    setInterval(() => this.simulateSensorUpdate(), 10000);
  }

  private generateHistory(min: number, max: number): {time: Date, value: number}[] {
    const history = [];
    for (let i = 0; i < 24; i++) {
      history.push({
        time: new Date(Date.now() - 1000 * 60 * 60 * i),
        value: +(min + Math.random() * (max - min)).toFixed(1)
      });
    }
    return history;
  }

  private handleIoTEvent(payload: any): void {
    // Find relevant sensor and update its values
    const sensor = this.sensors.find(s => 
      s.type.toLowerCase() === 'moisture' && 
      s.location.includes(payload.location)
    );
    
    if (sensor) {
      sensor.value = payload.value;
      sensor.lastUpdated = new Date();
      sensor.status = payload.value < 30 ? 'critical' : 'normal';
      sensor.history.unshift({time: new Date(), value: payload.value});
      sensor.history = sensor.history.slice(0, 24);
      
      this.notificationService.showWarning(
        `Sensor ${sensor.name} in ${sensor.location} reported ${sensor.value}${sensor.unit}`
      );
    }
  }

  private simulateSensorUpdate(): void {
    // Randomly update one sensor
    const index = Math.floor(Math.random() * this.sensors.length);
    const sensor = this.sensors[index];
    
    // Calculate new value based on sensor type
    let newValue;
    let status: 'normal' | 'warning' | 'critical' = 'normal';
    
    switch (sensor.type) {
      case 'moisture':
        newValue = +(Math.random() * 100).toFixed(1);
        status = newValue < 30 ? 'critical' : newValue < 40 ? 'warning' : 'normal';
        break;
      case 'temperature':
        newValue = +(20 + Math.random() * 15).toFixed(1);
        status = newValue > 28 ? 'warning' : 'normal';
        break;
      case 'pH':
        newValue = +(6 + Math.random() * 2).toFixed(1);
        status = (newValue < 6.5 || newValue > 7.5) ? 'warning' : 'normal';
        break;
      case 'humidity':
        newValue = +(60 + Math.random() * 30).toFixed(1);
        status = 'normal';
        break;
      case 'light':
        newValue = Math.floor(500 + Math.random() * 1000);
        status = 'normal';
        break;
      default:
        newValue = sensor.value;
    }
    
    // Update sensor
    sensor.value = newValue;
    sensor.status = status;
    sensor.lastUpdated = new Date();
    sensor.history.unshift({time: new Date(), value: newValue});
    sensor.history = sensor.history.slice(0, 24);
    
    // If critical, send notification
    if (status === 'critical') {
      this.notificationService.showError(
        `ALERT: ${sensor.name} in ${sensor.location} is critical: ${sensor.value}${sensor.unit}`
      );
    } else if (status === 'warning') {
      this.notificationService.showWarning(
        `WARNING: ${sensor.name} in ${sensor.location}: ${sensor.value}${sensor.unit}`
      );
    }
  }
}