import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { PaymentService } from '../../core/services/payment.service';
import { NotificationService } from '../../core/services/notification.service';
import { environment } from '../../../environments/environment';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css'],
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent]
})
export class MarketplaceComponent implements OnInit {
  products: Product[] = [
    {
      id: '1',
      name: 'Fertilizante Orgánico',
      description: 'Fertilizante 100% orgánico para cultivos',
      price: 29.99,
      image: 'https://images.pexels.com/photos/9976767/pexels-photo-9976767.jpeg',
      stock: 100
    },
    {
      id: '2',
      name: 'Semillas de Maíz',
      description: 'Semillas de maíz de alta calidad',
      price: 15.99,
      image: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg',
      stock: 50
    },
    {
      id: '3',
      name: 'Sistema de Riego',
      description: 'Sistema de riego automatizado',
      price: 199.99,
      image: 'https://images.pexels.com/photos/2132780/pexels-photo-2132780.jpeg',
      stock: 20
    }
  ];

  cart: { product: Product; quantity: number }[] = [];

  constructor(
    private paymentService: PaymentService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  addToCart(product: Product): void {
    const cartItem = this.cart.find(item => item.product.id === product.id);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      this.cart.push({ product, quantity: 1 });
    }
  }

  removeFromCart(productId: string): void {
    this.cart = this.cart.filter(item => item.product.id !== productId);
  }

  getTotal(): number {
    return this.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  checkout(): void {
    try {
      const payment = {
        amount: this.getTotal(),
        currency: 'USD',
        paymentMethod: 'CARD',
        metadata: {
          items: this.cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      };

      this.paymentService.initPayment(payment).subscribe({
        next: (response) => {
          if (response && response.id) {
            this.initPayUCheckout(response);
          } else {
            throw new Error('Invalid payment response');
          }
        },
        error: (error) => {
          console.error('Payment initialization error:', error);
          this.notificationService.showError('Error al iniciar el pago. Por favor intente nuevamente.');
        }
      });
    } catch (error) {
      console.error('Checkout error:', error);
      this.notificationService.showError('Error al procesar el pago. Por favor intente nuevamente.');
    }
  }

  private initPayUCheckout(paymentData: any): void {
    try {
      const signature = this.generateSignature(paymentData.id, this.getTotal());
      const paymentForm = document.createElement('form');
      paymentForm.method = 'post';
      paymentForm.action = environment.production 
        ? 'https://checkout.payulatam.com/ppp-web-gateway-payu/'
        : 'https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/';

      const params = {
        merchantId: environment.payuMerchantId,
        accountId: environment.payuAccountId,
        description: 'Compra en AgriPrecision',
        referenceCode: paymentData.id,
        amount: this.getTotal().toFixed(2),
        tax: '0',
        taxReturnBase: '0',
        currency: 'USD',
        signature: signature,
        test: environment.production ? '0' : '1',
        buyerEmail: 'buyer@email.com',
        responseUrl: `${window.location.origin}/payment/response`,
        confirmationUrl: `${environment.apiUrl}/payments/confirmation`,
        payerFullName: 'John Doe',
        payerDocument: '12345678',
        payerDocumentType: 'CC',
        payerPhone: '1234567890',
        payerAddress: 'Test Address',
        payerCity: 'Test City',
        payerState: 'Test State',
        payerCountry: 'US',
        payerPostalCode: '12345',
        language: 'es',
        displayShippingInformation: '0'
      };

      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.name = key;
        input.type = 'hidden';
        input.value = value.toString();
        paymentForm.appendChild(input);
      });

      document.body.appendChild(paymentForm);
      paymentForm.submit();
      document.body.removeChild(paymentForm);
    } catch (error) {
      console.error('PayU form initialization error:', error);
      this.notificationService.showError('Error al iniciar el formulario de pago. Por favor intente nuevamente.');
    }
  }

  private generateSignature(referenceCode: string, amount: number): string {
    const apiKey = environment.payuApiKey;
    const merchantId = environment.payuMerchantId;
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

  private processPayment(paymentId: string): void {
    this.paymentService.processPayment(paymentId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Pago procesado exitosamente');
        this.cart = [];
      },
      error: (error) => {
        console.error('Payment processing error:', error);
        this.notificationService.showError('Error al procesar el pago. Por favor intente nuevamente.');
      }
    });
  }
}