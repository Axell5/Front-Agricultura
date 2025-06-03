import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { NotificationService } from '../../core/services/notification.service';
import { PaymentService, PaymentRequest } from '../../core/services/payment.service';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
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
  imports: [CommonModule, ButtonComponent]
})
export class MarketplaceComponent {
  products: Product[] = [
    {
      id: 1,
      name: 'Organic Fertilizer',
      description: 'High-quality organic fertilizer for optimal plant growth',
      price: 29.99,
      image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg'
    },
    {
      id: 2,
      name: 'Smart Irrigation Controller',
      description: 'Automated irrigation system with smart scheduling',
      price: 149.99,
      image: 'https://images.pexels.com/photos/3016430/pexels-photo-3016430.jpeg'
    },
    {
      id: 3,
      name: 'Soil pH Meter',
      description: 'Professional soil pH testing kit for precise measurements',
      price: 39.99,
      image: 'https://images.pexels.com/photos/4505257/pexels-photo-4505257.jpeg'
    },
    {
      id: 4,
      name: 'Premium Seeds Pack',
      description: 'Collection of high-yield crop seeds',
      price: 24.99,
      image: 'https://images.pexels.com/photos/7728345/pexels-photo-7728345.jpeg'
    },
    {
      id: 5,
      name: 'Weather Station',
      description: 'Professional weather monitoring system',
      price: 199.99,
      image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg'
    },
    {
      id: 6,
      name: 'Drone Mapping Service',
      description: 'Monthly subscription for aerial field mapping',
      price: 299.99,
      image: 'https://images.pexels.com/photos/1087180/pexels-photo-1087180.jpeg'
    }
  ];

  cartItems: CartItem[] = [];
  showCart = false;
  loading = false;

  constructor(
    private notificationService: NotificationService,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  get cartItemsCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  get cartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  toggleCart(): void {
    this.showCart = !this.showCart;
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
    
    this.notificationService.showSuccess('Added to cart');
  }

  increaseQuantity(item: CartItem): void {
    item.quantity++;
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.cartItems = this.cartItems.filter(cartItem => cartItem.product.id !== item.product.id);
    }
  }

  checkout(): void {
    if (!this.authService.currentUserValue) {
      this.notificationService.showError('Please login to proceed with checkout');
      return;
    }

    this.loading = true;
    const payment: PaymentRequest = {
      referenceCode: `ORDER-${Date.now()}`,
      description: `Purchase of ${this.cartItemsCount} items`,
      amount: this.cartTotal,
      currency: 'COP',
      buyerEmail: this.authService.currentUserValue.email
    };

    this.paymentService.createPayment(payment).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Payment processed successfully');
        this.cartItems = [];
        this.showCart = false;
      },
      error: (error) => {
        this.notificationService.showError('Payment failed. Please try again.');
        console.error('Payment error:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}