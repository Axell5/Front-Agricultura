import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface Notification {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();

  constructor() {}

  showSuccess(message: string): void {
    this.notificationSubject.next({ type: 'success', message });
  }

  showInfo(message: string): void {
    this.notificationSubject.next({ type: 'info', message });
  }

  showWarning(message: string): void {
    this.notificationSubject.next({ type: 'warning', message });
  }

  showError(message: string): void {
    this.notificationSubject.next({ type: 'error', message });
  }
}