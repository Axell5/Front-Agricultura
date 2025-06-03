import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface PaymentRequest {
  referenceCode: string;
  description: string;
  amount: number;
  currency: string;
  buyerEmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  createPayment(payment: PaymentRequest): Observable<any> {
    // Mock successful payment response
    const mockResponse = {
      status: 'APPROVED',
      transactionId: Math.random().toString(36).substring(2, 15),
      referenceCode: payment.referenceCode,
      amount: payment.amount,
      currency: payment.currency,
      timestamp: new Date().toISOString()
    };

    // Simulate network delay
    return of(mockResponse).pipe(delay(1000));
  }
}