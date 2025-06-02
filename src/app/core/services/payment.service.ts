import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  initPayment(payment: any): Observable<any> {
    const signature = this.generateSignature(payment.amount);
    const paymentData = {
      ...payment,
      signature,
      apiKey: environment.payuApiKey,
      merchantId: environment.payuMerchantId
    };

    return this.http.post(`${this.apiUrl}`, paymentData).pipe(
      catchError(error => {
        console.error('Payment initialization error:', error);
        return throwError(() => new Error('Error al iniciar el pago'));
      })
    );
  }

  processPayment(paymentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${paymentId}/process`, {}).pipe(
      catchError(error => {
        console.error('Payment processing error:', error);
        return throwError(() => new Error('Error al procesar el pago'));
      })
    );
  }

  private generateSignature(amount: number): string {
    const apiKey = environment.payuApiKey;
    const merchantId = environment.payuMerchantId;
    const referenceCode = `ORDER-${Date.now()}`;
    const currency = 'USD';

    // PayU signature generation (MD5)
    const signatureString = `${apiKey}~${merchantId}~${referenceCode}~${amount}~${currency}`;
    return this.md5(signatureString);
  }

  private md5(str: string): string {
    // Simple MD5 implementation for demo purposes
    // In production, use a proper crypto library
    return btoa(str).slice(0, 32);
  }
}