import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  initPayment(payment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, payment);
  }

  processPayment(paymentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${paymentId}/process`, {});
  }
}