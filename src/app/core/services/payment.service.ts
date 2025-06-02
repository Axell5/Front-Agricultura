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
    return this.http.post(`${this.apiUrl}`, payment).pipe(
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
}