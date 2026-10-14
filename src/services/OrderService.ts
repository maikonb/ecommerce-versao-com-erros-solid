
import { IOrderRepository } from '../repositories/IOrderRepository';
import { NotificationService } from './NotificationService';

import { IPaymentMethod } from '../payments/IPaymentMethod';
import { CreditCardPayment } from '../payments/CreditCardPayment';
import { PixPayment } from '../payments/PixPayment';
import { ProductFactory } from '../domain/ProductFactory';



export class OrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private notificationService: NotificationService
  ) {}


private getPaymentMethod(paymentMethod: string): IPaymentMethod {
  if (paymentMethod === 'credit_card') {
    return new CreditCardPayment();
  }

  if (paymentMethod === 'pix') {
    return new PixPayment();
  }

  throw new Error('Método de pagamento não suportado');
}



  async saveOrder(
    customer: string,
    productsDetails: any[],
    totalAmount: number
  ) {
    const order = await this.orderRepository.create({
      customer,
      items: JSON.stringify(productsDetails),
      total: totalAmount,
      status: 'confirmed'
    });

    const email = await this.notificationService.sendOrderConfirmation(
      customer,
      order.id,
      totalAmount,
      productsDetails
    );

    return {
      order,
      emailPreview: email.previewUrl
    };
  }
}
