import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  initPayment(payment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, payment).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Payment initialization error:', error);
        return throwError(() => error);
      })
    );
  }

  processPayment(paymentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${paymentId}/process`, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Payment processing error:', error);
        return throwError(() => error);
      })
    );
  }
}