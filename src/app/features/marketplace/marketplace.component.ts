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
        this.openPayUCheckout(response);
      },
      error: (error) => {
        this.notificationService.showError('Error al iniciar el pago');
      }
    });
  }

  private openPayUCheckout(paymentData: any): void {
    const handler = window.payU.checkout.configure({
      publicKey: environment.payuPublicKey,
      merchantId: environment.payuMerchantId,
      accountId: environment.payuAccountId,
      currency: 'USD',
      amount: this.getTotal(),
      description: 'Compra en AgriPrecision',
      referenceCode: paymentData.id,
      signature: paymentData.signature,
      test: environment.production ? 0 : 1,
      onSuccess: (response: any) => {
        this.processPayment(paymentData.id, response);
      },
      onError: (error: any) => {
        this.notificationService.showError('Error en el pago');
      },
      onClose: () => {
        this.notificationService.showInfo('Pago cancelado');
      }
    });

    handler.open();
  }

  private processPayment(paymentId: string, payuResponse: any): void {
    this.paymentService.processPayment(paymentId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Pago procesado exitosamente');
        this.cart = [];
      },
      error: () => {
        this.notificationService.showError('Error al procesar el pago');
      }
    });
  }
}