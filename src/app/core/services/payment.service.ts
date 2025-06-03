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
  private apiUrl = 'http://localhost:8000/pago';

  constructor(private http: HttpClient) {}

  createPayment(payment: PaymentRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, payment);
  }
}