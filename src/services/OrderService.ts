
import { injectable, inject } from 'inversify';

import { IOrderRepository } from '../repositories/IOrderRepository';
import { IProductRepository } from '../repositories/IProductRepository';
import { NotificationService } from './NotificationService';
import { PaymentMethodRegistry } from '../payments/PaymentMethodRegistry';
import { ProductFactory } from '../domain/ProductFactory';
import { TYPES } from '../container/types';

@injectable()
export class OrderService {
  constructor(
    @inject(TYPES.OrderRepository)
    private orderRepository: IOrderRepository,

    @inject(TYPES.ProductRepository)
    private productRepository: IProductRepository,

    @inject(TYPES.NotificationService)
    private notificationService: NotificationService,

    @inject(TYPES.PaymentMethodRegistry)
    private paymentMethodRegistry: PaymentMethodRegistry
  ) {}

  async processOrder(
    customer: string,
    items: { productId: number; quantity: number }[],
    paymentMethod: string,
    paymentDetails: any
  ) {
    if (!items || items.length === 0) {
      throw new Error('O carrinho está vazio');
    }

    const productsDetails = [];
    let totalAmount = 0;

    for (const item of items) {
      if (item.quantity <= 0) {
        throw new Error('A quantidade do produto deve ser maior que zero');
      }

      const productData = await this.productRepository.findById(
        item.productId
      );

      if (!productData) {
        throw new Error(`Produto ${item.productId} não encontrado`);
      }

      const product = ProductFactory.create(productData);

      const freight = product.calculateFreight();
      const subtotal = product.price * item.quantity;
      const itemTotal = subtotal + freight;

      totalAmount += itemTotal;

      productsDetails.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        freight,
        total: itemTotal
      });
    }

    const payment = this.paymentMethodRegistry.get(paymentMethod);

    await payment.process(paymentDetails);

    return this.saveOrder(customer, productsDetails, totalAmount);
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

