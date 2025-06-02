import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
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

  async processPayment(id: string): Promise<Payment> {
    const payment = await this.findOne(id);
    
    // Aquí iría la integración con PayU
    try {
      // Simular procesamiento de pago
      payment.status = PaymentStatus.PROCESSING;
      await this.paymentsRepository.save(payment);
      
      // Simular respuesta exitosa de PayU
      payment.status = PaymentStatus.COMPLETED;
      payment.transactionId = `PAY-${Date.now()}`;
      return await this.paymentsRepository.save(payment);
    } catch (error) {
      payment.status = PaymentStatus.FAILED;
      await this.paymentsRepository.save(payment);
      throw error;
    }
  }
}