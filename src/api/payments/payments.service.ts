import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly payuApiUrl = 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi';
  private readonly payuApiKey = '4Vj8eK4rloUd272L48hsrarnUA';
  private readonly payuMerchantId = '508029';
  private readonly payuAccountId = '512321';

  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentsRepository.create(createPaymentDto);
    return await this.paymentsRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentsRepository.find();
  }

  async findOne(id: string): Promise<Payment> {
    return await this.paymentsRepository.findOneOrFail({ where: { id } });
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    await this.paymentsRepository.update(id, updatePaymentDto);
    return await this.findOne(id);
  }

  private generateSignature(referenceCode: string, amount: number, currency: string): string {
    const signatureString = `${this.payuApiKey}~${this.payuMerchantId}~${referenceCode}~${amount}~${currency}`;
    return crypto.createHash('md5').update(signatureString).digest('hex');
  }

  async processPayment(id: string): Promise<Payment> {
    const payment = await this.findOne(id);
    
    try {
      payment.status = PaymentStatus.PROCESSING;
      await this.paymentsRepository.save(payment);

      const metadata = payment.metadata || {};
      const payuPayload = {
        language: 'es',
        command: 'SUBMIT_TRANSACTION',
        merchant: {
          apiKey: this.payuApiKey,
          apiLogin: 'pRRXKOl8ikMmt9u',
        },
        transaction: {
          order: {
            accountId: this.payuAccountId,
            referenceCode: payment.id,
            description: 'Payment for products',
            language: 'es',
            signature: this.generateSignature(payment.id, payment.amount, payment.currency),
            notifyUrl: 'http://localhost:3000/payments/notification',
            additionalValues: {
              TX_VALUE: {
                value: payment.amount,
                currency: payment.currency
              }
            },
            buyer: {
              merchantBuyerId: 'buyer_123',
              fullName: metadata['buyerName'] || 'John Doe',
              emailAddress: metadata['buyerEmail'] || 'buyer@example.com',
              contactPhone: metadata['buyerPhone'] || '7563126',
              dniNumber: metadata['buyerDni'] || '123456789'
            }
          },
          creditCard: {
            number: '4097440000000004',
            securityCode: '321',
            expirationDate: '2025/12',
            name: 'APPROVED'
          },
          type: 'AUTHORIZATION_AND_CAPTURE',
          paymentMethod: payment.paymentMethod,
          paymentCountry: 'CO',
          deviceSessionId: 'vghs6tvkcle931686k1900o6e1',
          ipAddress: '127.0.0.1',
          cookie: 'pt1t38347bs6jc9ruv2ecpv7o2',
          userAgent: 'Mozilla/5.0 (Windows NT 5.1; rv:18.0) Gecko/20100101 Firefox/18.0'
        },
        test: true
      };

      const response = await axios.post(this.payuApiUrl, payuPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.code === 'SUCCESS') {
        payment.status = PaymentStatus.COMPLETED;
        payment.transactionId = response.data.transactionResponse.transactionId;
      } else {
        payment.status = PaymentStatus.FAILED;
        throw new HttpException(
          response.data.error || 'Payment processing failed',
          HttpStatus.BAD_REQUEST
        );
      }

      return await this.paymentsRepository.save(payment);
    } catch (error: any) {
      payment.status = PaymentStatus.FAILED;
      await this.paymentsRepository.save(payment);
      
      throw new HttpException(
        error.response?.data?.error || 'Payment processing failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}