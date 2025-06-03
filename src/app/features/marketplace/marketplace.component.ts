import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { PaymentService } from '../../core/services/payment.service';
import { NotificationService } from '../../core/services/notification.service';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css'],
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, ReactiveFormsModule]
})
export class MarketplaceComponent implements OnInit {
  products: Product[] = [
    {
      id: '1',
      name: 'Organic Fertilizer',
      description: '100% organic fertilizer for crops',
      price: 29.99,
      image: 'https://images.pexels.com/photos/9976767/pexels-photo-9976767.jpeg',
      stock: 100
    },
    {
      id: '2',
      name: 'Corn Seeds',
      description: 'High-quality corn seeds',
      price: 15.99,
      image: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg',
      stock: 50
    },
    {
      id: '3',
      name: 'Irrigation System',
      description: 'Automated irrigation system',
      price: 199.99,
      image: 'https://images.pexels.com/photos/2132780/pexels-photo-2132780.jpeg',
      stock: 20
    }
  ];

  cart: CartItem[] = [];
  showPaymentForm = false;
  paymentForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private paymentService: PaymentService,
    private notificationService: NotificationService
  ) {
    this.paymentForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  addToCart(product: Product): void {
    const cartItem = this.cart.find(item => item.product.id === product.id);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      this.cart.push({ product, quantity: 1 });
    }
    this.notificationService.showSuccess('Item added to cart');
  }

  removeFromCart(productId: string): void {
    this.cart = this.cart.filter(item => item.product.id !== productId);
  }

  increaseQuantity(item: CartItem): void {
    if (item.quantity < item.product.stock) {
      item.quantity++;
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeFromCart(item.product.id);
    }
  }

  getTotal(): number {
    return this.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  processPayment(): void {
    if (this.paymentForm.invalid) {
      return;
    }

    this.loading = true;
    const payment = {
      referenceCode: `ORDER-${Date.now()}`,
      description: 'Purchase from AgriPrecision Marketplace',
      amount: this.getTotal(),
      currency: 'COP',
      buyerEmail: this.paymentForm.get('email')?.value
    };

    this.paymentService.createPayment(payment).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.code === 'SUCCESS') {
          this.notificationService.showSuccess('Payment processed successfully');
          this.cart = [];
          this.showPaymentForm = false;
        } else {
          this.notificationService.showError('Payment failed: ' + response.error);
        }
      },
      error: (error) => {
        this.loading = false;
        this.notificationService.showError('Payment failed. Please try again.');
      }
    });
  }
}