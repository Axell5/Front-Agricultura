import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

declare global {
  interface Window {
    payU: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {
    this.loadPayUScript();
  }

  private loadPayUScript() {
    const script = document.createElement('script');
    script.src = 'https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/';
    document.body.appendChild(script);
  }

  initPayment(payment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, payment);
  }

  processPayment(paymentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${paymentId}/process`, {});
  }
}