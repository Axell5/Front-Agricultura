import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface EventMessage {
  type: string;
  payload: any;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventSubject = new Subject<EventMessage>();
  public events$ = this.eventSubject.asObservable();

  constructor() {}

  // Simulates receiving events from a message broker
  simulateEvent(eventType: string, payload: any): void {
    this.eventSubject.next({ type: eventType, payload });
  }

  // Actual event handlers for different event types
  handleIoTEvent(payload: any): void {
    console.log('IoT event received:', payload);
    // Process the IoT event and trigger UI updates
    this.eventSubject.next({ type: 'iot', payload });
  }

  handlePaymentEvent(payload: any): void {
    console.log('Payment event received:', payload);
    this.eventSubject.next({ type: 'payment', payload });
  }

  handleMessageEvent(payload: any): void {
    console.log('Message event received:', payload);
    this.eventSubject.next({ type: 'message', payload });
  }

  handleRewardEvent(payload: any): void {
    console.log('Reward event received:', payload);
    this.eventSubject.next({ type: 'reward', payload });
  }

  handleAIAnalysisEvent(payload: any): void {
    console.log('AI Analysis event received:', payload);
    this.eventSubject.next({ type: 'ai-analysis', payload });
  }
}