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
    },
    {
      id: '4',
      name: 'Soil pH Meter',
      description: 'Digital pH meter for soil testing',
      price: 49.99,
      image: 'https://images.pexels.com/photos/4505257/pexels-photo-4505257.jpeg',
      stock: 30
    },
    {
      id: '5',
      name: 'Organic Pesticide',
      description: 'Natural pest control solution',
      price: 34.99,
      image: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg',
      stock: 75
    },
    {
      id: '6',
      name: 'Garden Tools Set',
      description: 'Complete set of essential garden tools',
      price: 89.99,
      image: 'https://images.pexels.com/photos/2736497/pexels-photo-2736497.jpeg',
      stock: 25
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
      email: ['', [Validators.required, Validators.email]],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });
  }

  ngOnInit(): void {}

  addToCart(product: Product): void {
    const cartItem = this.cart.find(item => item.product.id === product.id);
    if (cartItem) {
      if (cartItem.quantity < product.stock) {
        cartItem.quantity++;
        this.notificationService.showSuccess('Quantity updated');
      } else {
        this.notificationService.showWarning('Maximum stock reached');
      }
    } else {
      this.cart.push({ product, quantity: 1 });
      this.notificationService.showSuccess('Item added to cart');
    }
  }

  removeFromCart(productId: string): void {
    this.cart = this.cart.filter(item => item.product.id !== productId);
    this.notificationService.showInfo('Item removed from cart');
  }

  increaseQuantity(item: CartItem): void {
    if (item.quantity < item.product.stock) {
      item.quantity++;
    } else {
      this.notificationService.showWarning('Maximum stock reached');
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
      this.notificationService.showError('Please fill all payment details correctly');
      return;
    }

    this.loading = true;
    const payment = {
      referenceCode: `ORDER-${Date.now()}`,
      description: `Purchase from AgriPrecision - ${this.cart.length} items`,
      amount: this.getTotal(),
      currency: 'COP',
      buyerEmail: this.paymentForm.get('email')?.value
    };

    this.paymentService.createPayment(payment).subscribe({
      next: (response) => {
        if (response.code === 'SUCCESS') {
          this.processPayUPayment(response.data);
        } else {
          this.loading = false;
          this.notificationService.showError('Payment initialization failed: ' + response.error);
        }
      },
      error: (error) => {
        this.loading = false;
        this.notificationService.showError('Payment failed. Please try again.');
      }
    });
  }

  private processPayUPayment(paymentData: any): void {
    // Create and submit PayU form
    const form = document.createElement('form');
    form.method = 'post';
    form.action = paymentData.paymentUrl;

    // Add all necessary PayU fields
    Object.entries(paymentData.formData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value as string;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }
}