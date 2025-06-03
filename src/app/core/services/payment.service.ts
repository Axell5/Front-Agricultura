import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  private apiUrl = `${environment.apiUrl}/pago`;

  constructor(private http: HttpClient) {}

  createPayment(payment: PaymentRequest): Observable<any> {
    return this.http.post(this.apiUrl, payment);
  }
}